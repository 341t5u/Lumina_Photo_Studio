# AUTH.md — Authentication, Authorization & Security

## 1. Authentication Strategy

The application supports two distinct roles managed via local session storage:

- **Client Role:** Users register by providing their Full Name, City/Location, Password, and a validated Ethiopian phone number. Upon registration, a client session token/role is stored in `localStorage`.
- **Admin Role:** Authorized administrators access the management dashboard using predefined administrative credentials (`admin@lumina.com`).

## 2. Authorization & Route Protection

- **Dashboard Guard:** The Admin Dashboard (`/dashboard`) explicitly checks `localStorage.getItem('userRole')`. If the user role is not `"admin"`, access is denied (`Access Denied: Admin privileges required`) and the user is redirected to the login page.
- **Booking Guard:** The Booking Form (`/bookings`) features an authentication overlay. If a client attempts to book a session while logged out, the form locks down and prompts them to log in or create an account first.

## 3. Input Validation & Data Security

- **Ethiopian Phone Validation:** Form inputs enforce strict regex matching (`/^(09|07)\d{8}$/`) to guarantee that all client phone numbers conform to standard Ethiopian mobile formatting (10 digits starting with `09` or `07`).
- **Date Constraints:** The booking calendar enforces a native HTML `min` attribute set to today's date (`YYYY-MM-DD`) and validates submissions via JavaScript to prevent past-date reservations.
