import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      const res = await register(
        formData.name,
        formData.email,
        formData.password
      );
      if (res.success) {
        showToast('Account created successfully! Welcome aboard.', 'success');
        navigate('/dashboard');
      } else {
        showToast(res.message || 'Registration failed.', 'danger');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to create account. Please try again.';
      showToast(errorMsg, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="w-100" style={{ maxWidth: '460px' }}>
        {/* Card */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="p-4 p-sm-5">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: '54px', height: '54px' }}
              >
                <FaGraduationCap className="fs-2" />
              </div>
              <h3 className="fw-bold text-dark mt-2 mb-1">Create Account</h3>
              <p className="text-muted small">
                Sign up to start organizing assignments and tasks
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control border-start-0 ps-1 ${
                      errors.name ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g. Sophea Meas"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">{errors.name}</div>
                  )}
                </div>
              </div>

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
              <div className="mb-3">
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
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <FaLock />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control border-start-0 ps-1 ${
                      errors.confirmPassword ? 'is-invalid' : ''
                    }`}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-semibold text-primary text-decoration-none">
                Sign in
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

export default Register;
