import React from 'react';
import { TextField, FormHelperText } from '@material-ui/core';
import { useSignIn } from '@frontend/shared/hooks/auth';
import VerifyEmailForm from './VerifyEmailForm';
import LoadingButton from '../common/LoadingButton';
import PasswordInput from '../common/PasswordInput';
import ForgetPasswordForm from './ForgetPasswordForm';
import { onAlert } from '../../utils/alert';
import SocialSignIn from './SocialSignIn';

export default function SignInForm() {
  const { state, setState, formik } = useSignIn({ onAlert });

  if (state.showForgetPasswordForm) {
    return (
      <ForgetPasswordForm
        handleShowSignInForm={() => setState({ ...state, showForgetPasswordForm: false })}
      />
    );
  } else if (state.verify) {
    return (
      <VerifyEmailForm
        onSuccess={formik.handleSubmit}
        email={state.email}
        label="Sign In Again?"
        onLabelClick={() => setState({ ...state, verify: false })}
      />
    );
  } else {
    return (
      <form onSubmit={formik.handleSubmit} data-testid="signin-form">
        <TextField
          fullWidth
          className="my-3"
          label="Email*"
          name="email"
          variant="outlined"
          type="text"
          size="small"
          disabled={formik.isSubmitting}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <PasswordInput
          disabled={formik.isSubmitting}
          fullWidth
          className="my-3"
          label="Password*"
          name="password"
          variant="outlined"
          size="small"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          labelWidth={80}
        />
        <FormHelperText
          data-testid="forget-password-text"
          role="button"
          className="cursor-pointer d-inline-block"
          onClick={() => setState({ ...state, showForgetPasswordForm: true })}>
          Lost your password?
        </FormHelperText>
        <br />
        <LoadingButton
          data-testid="signin-button"
          type="submit"
          loading={formik.isSubmitting}
          className="mt-2">
          Sign In
        </LoadingButton>
        <br />
        <SocialSignIn />
      </form>
    );
  }
}
