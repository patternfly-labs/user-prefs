// @ts-nocheck
import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";
// import { UserPreferenceCustomField as CustomFieldType } from "@console/dynamic-plugin-sdk/src";
// import { UserPreferenceFieldProps } from "./types";

// type UserPreferenceCustomFieldProps = UserPreferenceFieldProps<CustomFieldType>;

const UserPreferenceCustomField /*: React.FC<UserPreferenceCustomFieldProps>*/ = ({
  id,
  component,
  props,
  componentResolver,
  propsResolver
}) => {
  // debugger;
  let Component = () => <div>{component.$codeRef} not found</div>;
  const additionalProps = (propsResolver && propsResolver[id]) || {};
  if (componentResolver && componentResolver[component.$codeRef]) {
    Component = componentResolver[component.$codeRef];
  }
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading</div>}>
        <Component {...props} {...additionalProps} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
export default UserPreferenceCustomField;
