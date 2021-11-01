// @ts-nocheck
import * as React from "react";
import {
  Skeleton,
  SelectOption,
  Select,
  SelectVariant
} from "@patternfly/react-core";
// import { useTranslation } from 'react-i18next';
// import { isPerspective, Perspective, useExtensions } from '@console/plugin-sdk';
import { usePreferredPerspective } from "./usePreferredPerspective";

const PerspectiveDropdown: React.FC = () => {
  // resources and calls to hooks
  // const { t } = useTranslation();
  // const perspectiveExtensions = useExtensions<Perspective>(isPerspective);
  // const allPerspectives = perspectiveExtensions.map((extension) => extension.properties);
  const allPerspectives = React.useMemo(() => {
    return [
      {
        id: "admin",
        name: "Administrator",
        icon: {
          key: null,
          ref: null,
          props: {
            color: "currentColor",
            size: "sm",
            noVerticalAlign: false
          },
          _owner: null,
          _store: {}
        },
        default: true
      },
      {
        id: "dev",
        name: "Developer",
        icon: {
          key: null,
          ref: null,
          props: {
            color: "currentColor",
            size: "sm",
            noVerticalAlign: false
          },
          _owner: null,
          _store: {}
        },
        defaultPins: ["core~v1~ConfigMap", "core~v1~Secret"]
      }
    ];
  }, []);
  const [
    preferredPerspective,
    setPreferredPerspective,
    preferredPerspectiveLoaded
  ] = usePreferredPerspective();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const loaded: boolean = preferredPerspectiveLoaded;
  const lastViewedLabel: string = "Last viewed";

  const selectOptions: JSX.Element[] = React.useMemo(() => {
    const lastPerspectiveOption = (
      <SelectOption key={"lastViewed"} value={lastViewedLabel} />
    );
    const allPerspectiveOptions = allPerspectives
      .sort((currPerspective, nextPerspective) => {
        const { name: currPerspectiveName } = currPerspective;
        const { name: nextPerspectiveName } = nextPerspective;
        if (currPerspectiveName === nextPerspectiveName) {
          return 0;
        }
        return currPerspectiveName > nextPerspectiveName ? 1 : -1;
      })
      .map(({ name }) => <SelectOption key={name} value={name} />);
    return [lastPerspectiveOption, ...allPerspectiveOptions];
  }, [allPerspectives, lastViewedLabel]);

  // utils and callbacks
  const getDropdownLabelForValue = (): string =>
    preferredPerspective
      ? (allPerspectives.find(
          (perspective) => perspective.id === preferredPerspective
        )?.name as string)
      : lastViewedLabel;
  const getDropdownValueForLabel = (selectedLabel: string): string =>
    selectedLabel === lastViewedLabel
      ? null
      : allPerspectives.find(
          (perspective) => perspective.name === selectedLabel
        )?.id;
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen);
  const onSelect = (_, selection) => {
    const selectedValue = getDropdownValueForLabel(selection);
    selectedValue !== preferredPerspective &&
      setPreferredPerspective(selectedValue);
    setDropdownOpen(false);
  };

  return loaded ? (
    <Select
      variant={SelectVariant.single}
      isOpen={dropdownOpen}
      selections={getDropdownLabelForValue()}
      toggleId={"console.preferredPerspective"}
      onToggle={onToggle}
      onSelect={onSelect}
      placeholderText="Select a perspective"
      data-test={"dropdown console.preferredPerspective"}
      maxHeight={300}
    >
      {selectOptions}
    </Select>
  ) : (
    <Skeleton
      height="30px"
      width="100%"
      data-test={"dropdown skeleton console.preferredPerspective"}
    />
  );
};

export default PerspectiveDropdown;
