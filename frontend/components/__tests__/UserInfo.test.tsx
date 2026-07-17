import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserInfo from "../UserInfo";
import { useAuth } from "@/lib/auth-context";

// UserInfo reads auth state via useAuth(), so we mock the whole module and
// control what that hook returns in each test instead of rendering a real
// AuthProvider (which would need a backend to talk to).
jest.mock("@/lib/auth-context", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe("UserInfo", () => {
  test("renders nothing when there is no logged-in user", () => {
    mockedUseAuth.mockReturnValue({ user: null, logout: jest.fn() });
    const { container } = render(<UserInfo />);

    expect(container).toBeEmptyDOMElement();
  });

  test("shows the user's email when logged in", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, email: "alice@example.com", created_at: "2024-01-01" },
      logout: jest.fn(),
    });
    render(<UserInfo />);

    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  test("calls logout when Log Out is clicked", async () => {
    const user = userEvent.setup();
    const logout = jest.fn();
    mockedUseAuth.mockReturnValue({
      user: { id: 1, email: "alice@example.com", created_at: "2024-01-01" },
      logout,
    });
    render(<UserInfo />);

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
