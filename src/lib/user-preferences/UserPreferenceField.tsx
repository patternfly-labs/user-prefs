// @ts-nocheck
import * as React from "react";
import { FormGroup } from "@patternfly/react-core";
// import { UserPreferenceFieldType } from '@console/dynamic-plugin-sdk';
import { componentForFieldType } from "./const";
// import { ResolvedUserPreferenceItem } from './types';
import ErrorBoundary from "./ErrorBoundary";

// type UserPreferenceFieldProps = { item: ResolvedUserPreferenceItem };

const UserPreferenceField /*: React.FC<UserPreferenceFieldProps>*/ = ({
  item,
  componentResolver,
  propsResolver
}) => {
  const { id, label, field, description } = item;
  // React.useState(() => {
  //   console.log('UserPreferenceField');
  // }, [field]);
  const [boundaryKey, setBoundaryKey] = React.useState(0);

  const FieldComponent /*: React.FC<React.ComponentProps<
    typeof componentForFieldType[UserPreferenceFieldType]
  >>*/ =
    componentForFieldType[field.type];

  const reset = () => {
    console.log('reset');
    setBoundaryKey(boundaryKey + 1);
  }
  
  return (
    <ErrorBoundary key={boundaryKey} onClear={reset}>
      <FormGroup
        key={id}
        fieldId={id}
        label={label}
        helperText={description}
        data-test={`${id} field`}
      >
        {FieldComponent ? <FieldComponent id={id} {...field} componentResolver={componentResolver} propsResolver={propsResolver} /> : null}
      </FormGroup>
    </ErrorBoundary>
  );
};

export default UserPreferenceField;
