import * as React from "react";
import renderer from "react-test-renderer";

import { MonoText } from "../StyledText";

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!d</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});
