/* eslint-disable testing-library/no-unnecessary-act */
import { act, fireEvent, render, screen } from "@testing-library/react"
import user from '@testing-library/user-event'
import LoginComponent from "../app/LoginComponent"

describe('Login component tests', () => {
    // jest.fn() là một hàm được cung cấp để tạo ra một mock function, có thể được sử dụng để kiểm tra việc gọi hàm và các tham số được truyền vào đúng hay không trong các unit test.
    const loginServiceMock = {
        login: jest.fn()
    }
    const setTokenMock = jest.fn();

    let container: HTMLElement

    function setUp () {
        container = render(
            <LoginComponent
                loginService={loginServiceMock}
                setToken={setTokenMock}
            />
        ).container;
    }

    beforeEach(() => {
        setUp();
    })

    it('should render correctly the login component', () => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument(); // kiểm tra xem một phần tử đã được render trong DOM hay chưa.
        expect(screen.queryByTestId('resultLabel')).not.toBeInTheDocument()
    })

    it('should render correctly - query by test id', () => {
        const inputs = screen.getAllByTestId('input');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].getAttribute('value')).toBe('');
        expect(inputs[1].getAttribute('value')).toBe('');
        expect(inputs[2].getAttribute('value')).toBe('Login');
    })

    it('Click login button with incomplete credentials - show required message', () => {
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        fireEvent.click(loginButton);

        const resultLabel = screen.getByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('Username and password are required!')
    })

    it('Click login button with incomplete credentials - show required message - with user click', () => {
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        act(() => {
            user.click(loginButton);
        })

        const resultLabel = screen.getByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('Username and password are required!')
    })

    it('right credentials - successful login', async ()=>{
        loginServiceMock.login.mockResolvedValueOnce('1234');
        // eslint-disable-next-line testing-library/no-node-access
        const inputs = container.querySelectorAll('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        fireEvent.change(userNameInput, { target: { value: 'someUser'}});
        fireEvent.change(passwordInput, { target: { value: 'somePassword'}});
        fireEvent.click(loginButton);

        expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('successful login');
    })

    it('right credentials - successful login - with user calls', async ()=>{
        loginServiceMock.login.mockResolvedValueOnce('1234');
        // eslint-disable-next-line testing-library/no-node-access
        const inputs = container.querySelectorAll('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        act(()=>{
            user.click(userNameInput);
            user.keyboard('someUser');

            user.click(passwordInput);
            user.keyboard('somePassword');

            user.click(loginButton);
        });

        expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('successful login');
    });

    it('right credentials - unsuccessful login', async ()=>{
        loginServiceMock.login.mockResolvedValueOnce(undefined);
        // eslint-disable-next-line testing-library/no-node-access
        const inputs = container.querySelectorAll('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        fireEvent.change(userNameInput, { target: { value: 'someUser'}});
        fireEvent.change(passwordInput, { target: { value: 'somePassword'}});
        fireEvent.click(loginButton);

        expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel.textContent).toBe('invalid credentials');
    });
})