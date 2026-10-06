import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope, FaLock, FaSignInAlt, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        showToast('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      } else {
        showToast(res.message || 'Login failed. Please check credentials.', 'danger');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Invalid email or password. Please try again.';
      showToast(errorMsg, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setFormData({
      email: 'sophea@example.com',
      password: 'password123',
    });
    setErrors({});
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: '440px' }}>
        {/* Card */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="p-4 p-sm-5">
            {/* Header / Logo */}
            <div className="text-center mb-4">
              <div
                className="rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: '54px', height: '54px' }}
              >
                <FaGraduationCap className="fs-2" />
              </div>
              <h3 className="fw-bold text-dark mt-2 mb-1">Student Portal</h3>
              <p className="text-muted small">
                Sign in to manage your coursework, assignments & tasks
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control border-start-0 ps-1 ${
                      errors.email ? 'is-invalid' : ''
                    }`}
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control border-start-0 ps-1 ${
                      errors.password ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Helper */}
            <div className="mt-4 pt-3 border-top text-center">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-3"
                onClick={fillDemoAccount}
              >
                <FaInfoCircle />
                <span>Fill Demo Credentials</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-3">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-semibold text-primary text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-muted small mt-4">
          Student Task Management System &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default Login;
