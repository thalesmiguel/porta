import type { FunctionComponent } from 'react'

interface Props {
  onSubmitForm: (event: React.MouseEvent<HTMLButtonElement>) => Promise<unknown> | undefined;
  isFormValid: boolean;
}

const BraintreeSubmitFields: FunctionComponent<Props> = ({
  onSubmitForm,
  isFormValid
}) => (
  <div className="form-group">
    <div className="col-md-10 operations">
      <button
        className="btn btn-primary pull-right"
        disabled={!isFormValid}
        type="submit"
        onClick={onSubmitForm}
      >
        Save details
      </button>
    </div>
  </div>
)

export { BraintreeSubmitFields, Props }
