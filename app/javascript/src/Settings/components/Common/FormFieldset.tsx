// TODO: Replace this component when patternfly-react implements it.

import styles from '@patternfly/react-styles/css/components/Form/form'
import { css } from '@patternfly/react-styles'

type Props = React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  isInline?: boolean;
}

const FormFieldset: React.FunctionComponent<Props> = ({ children, className = '', isInline = false, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <fieldset {...props} className={css(styles.formFieldset, isInline ? styles.modifiers.inline : className)} >
    {children}
  </fieldset>
)

export { FormFieldset, Props }
