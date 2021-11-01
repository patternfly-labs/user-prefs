// @ts-nocheck
import * as React from "react";
import {
  Tabs,
  Tab,
  TabProps,
  TabTitleText,
  TabContent,
  TabContentProps
} from "@patternfly/react-core";
import UserPreferenceForm from "./UserPreferenceForm";
import { getUserPreferenceGroups } from "./utils/getUserPreferenceGroups";
import {
  // useResolvedExtensions,
  UserPreferenceGroup,
  isUserPreferenceGroup,
  UserPreferenceItem,
  isUserPreferenceItem
} from "../console-dynamic-plugin-sdk";
import { USER_PREFERENCES_BASE_URL } from "./const";
import { PageLayout, isModifiedEvent } from "../console-shared";
import { history } from '../public';
import './UserPreferencePage.scss';
import '../_vars.scss';
import '../_patternfly4.scss';

const LoadingBox = () => <div>Loading</div>;

const UserPreferencePage /*: React.FC<UserPreferencePageProps>*/ = ({ data, componentResolver, propsResolver }) => {
  const match = {
    params: {
      group: "general",
    },
  };

  // console.log(`match`);
  // console.log(match);

  const sortedUserPreferenceGroups = data
    .filter((item) => item.type === "console.user-preference/group")
    .map(({ properties }) => properties);
  const sortedUserPreferenceItems = data
    .filter((item) => item.type === "console.user-preference/item")
    .map(({ properties }) => properties);

  // fetch the default user preference group from the url params if available
  const {
    params: { group: groupIdFromUrl }
  } = match;
  // console.log(sortedUserPreferenceGroups);
  // console.log(groupIdFromUrl);
  const initialTabId =
    sortedUserPreferenceGroups.find(
      (extension) => extension.id === groupIdFromUrl
    )?.id || sortedUserPreferenceGroups[0]?.id;
  // console.log(initialTabId);
  const [activeTabId, setActiveTabId] = React.useState<string>(initialTabId);
  // console.log(activeTabId)
  const [userPreferenceTabs, userPreferenceTabContents] = React.useMemo<
    [React.ReactElement<TabProps>[], React.ReactElement<TabContentProps>[]]
  >(() => {
    const populatedUserPreferenceGroups /*: UserPreferenceTabGroup[]*/ = getUserPreferenceGroups(
      sortedUserPreferenceGroups,
      sortedUserPreferenceItems
    );
    const [tabs, tabContents] = populatedUserPreferenceGroups.reduce(
      (acc, currGroup) => {
        const { id, label, items } = currGroup;
        const ref = React.createRef<HTMLElement>();
        acc[0].push(
          <Tab
            key={id}
            eventKey={id}
            title={<TabTitleText>{label}</TabTitleText>}
            href={`${USER_PREFERENCES_BASE_URL}/${id}`}
            tabContentId={id}
            tabContentRef={ref}
            data-test={`tab ${id}`}
          />
        );
        acc[1].push(
          <TabContent
            key={id}
            eventKey={id}
            id={id}
            ref={ref}
            hidden={id !== activeTabId}
            data-test={`tab-content ${id}`}
          >
            <UserPreferenceForm items={items} componentResolver={componentResolver} propsResolver={propsResolver} />
          </TabContent>
        );
        return acc;
      },
      [[], []]
    );
    return [tabs, tabContents];
  }, [activeTabId, sortedUserPreferenceGroups, sortedUserPreferenceItems]);

  // utils and callbacks
  const handleTabClick = (
    event: React.MouseEvent<HTMLElement>,
    eventKey: string
  ) => {
    if (isModifiedEvent(event)) {
      return;
    }
    event.preventDefault();
    setActiveTabId(eventKey);
    history.replace(`${USER_PREFERENCES_BASE_URL}/${eventKey}`);
  };

  const userPreferenceItemResolved = true;

  return (
    <div className="co-user-preference-page">
      {/* <Helmet>
        <title>{t('console-app~User Preferences')}</title>
      </Helmet> */}
      <PageLayout
        title="User Preferences"
        hint="Set your individual preferences for the console experience. Any changes will be autosaved."
      >
        {userPreferenceItemResolved ? (
          <div className="co-user-preference-page-content">
            <div className="co-user-preference-page-content__tabs">
              <Tabs
                activeKey={activeTabId}
                onSelect={handleTabClick}
                isVertical
                variant="light300"
                data-test="user-preferences tabs"
              >
                {userPreferenceTabs}
              </Tabs>
            </div>
            <div className="co-user-preference-page-content__tab-content">
              {userPreferenceTabContents}
            </div>
          </div>
        ) : (
          <LoadingBox />
        )}
      </PageLayout>
    </div>
  );
};

export default UserPreferencePage;
