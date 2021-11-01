import React from "react";
import "./App.css";
import "@patternfly/react-core/dist/styles/base.css";
import { 
  Page,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody
} from "@patternfly/react-core";
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import UserPreferencePage from "./lib/user-preferences/UserPreferencePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { USER_PREFERENCES_BASE_URL } from './lib/user-preferences/const';
import data from "./data.json";

function App() {
  const [dataSet, setDataSet] = React.useState(data);
  React.useEffect(() => {
    console.log('updating dataSet');
    const sortedUserPreferenceGroups = dataSet
      .filter((item) => item.type === "console.user-preference/group");
    const sortedUserPreferenceItems = dataSet
      .filter((item) => item.type === "console.user-preference/item");
    setDataSet(sortedUserPreferenceGroups.concat(sortedUserPreferenceItems))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const componentResolver = React.useMemo(() => ({
    'userPreferences.PerspectiveDropdown': React.lazy(() => import(`./components/perspective/PerspectiveDropdown`)),
    'myOwnButton': React.lazy(() => import('./MyOwnButton'))
  }), []);

  const propsResolver = React.useMemo(() => ({
    'console.pfButton': {
      onClick: () => console.log('Clicked PF button')
    },
  }), []);

  // @ts-ignore
  const onEditorDidMount = (editor, monaco) => {
    // console.log(editor.getValue());
    editor.layout();
    editor.focus();
    // monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };
  // @ts-ignore
  const onChange = value => {
    // debugger;
    // console.log(value);
    try {
      setDataSet(JSON.parse(value));
    } catch (error) {
      // do nothing
    }
  };
  const panelContent = (
    <DrawerPanelContent defaultSize={'600px'}>
      <DrawerHead>
        <h3 className="pf-c-title pf-m-2xl">
          Config
        </h3>
      </DrawerHead>
      <DrawerPanelBody>
        <CodeEditor
          isLineNumbersVisible
          isLanguageLabelVisible
          code={JSON.stringify(dataSet, null, 2)}
          onChange={onChange}
          language={Language.json}
          onEditorDidMount={onEditorDidMount}
          height='1200px'
        />
        {/* <pre>{JSON.stringify(dataSet, null, 2)}</pre> */}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return ( 
    <Router>
      <Switch>
        <Route path={['/', USER_PREFERENCES_BASE_URL, `${USER_PREFERENCES_BASE_URL}/:group`]}>
          <Drawer isExpanded isInline>
            <DrawerContent panelContent={panelContent}>
              <DrawerContentBody>
              <Page>
                <UserPreferencePage data={dataSet} componentResolver={componentResolver} propsResolver={propsResolver} />
              </Page>
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
