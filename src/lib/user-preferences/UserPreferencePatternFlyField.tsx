// @ts-nocheck
import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Button } from '@patternfly/react-core';
// import { UserPreferenceCustomField as CustomFieldType } from "@console/dynamic-plugin-sdk/src";
// import { UserPreferenceFieldProps } from "./types";

// type UserPreferenceCustomFieldProps = UserPreferenceFieldProps<CustomFieldType>;

const UserPreferencePatternFlyField /*: React.FC<UserPreferenceCustomFieldProps>*/ = ({
  id,
  component,
  props,
  propsResolver,
}) => {
  // debugger;
  const Component = component.$codeRef ? React.lazy(
    () => import(`@patternfly/react-core/dist/esm/components/${component.$codeRef}/${component.$codeRef}`).then(module => ({ default: module[component.$codeRef] }))
  ) : null;
  const additionalProps = (propsResolver && propsResolver[id]) || {};
  return (
    <React.Suspense fallback={<div>Loading</div>}>
      <Component {...props} {...additionalProps} />
    </React.Suspense>
  );
};
export default UserPreferencePatternFlyField;
