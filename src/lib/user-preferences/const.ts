import { UserPreferenceFieldType } from "../console-dynamic-plugin-sdk";
import UserPreferenceCheckboxField from "./UserPreferenceCheckboxField";
import UserPreferenceCustomField from "./UserPreferenceCustomField";
import UserPreferenceDropdownField from "./UserPreferenceDropdownField";
import UserPreferencePatternFlyField from "./UserPreferencePatternFlyField";

export const USER_PREFERENCES_BASE_URL = "/user-preferences";
export const componentForFieldType = {
  [UserPreferenceFieldType.dropdown]: UserPreferenceDropdownField,
  [UserPreferenceFieldType.checkbox]: UserPreferenceCheckboxField,
  [UserPreferenceFieldType.custom]: UserPreferenceCustomField,
  [UserPreferenceFieldType.patternfly]: UserPreferencePatternFlyField
};
