import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import AllowDragFeature from '../src/components/DraughtsBoard/integrations/AllowDrag';
import WithMoveValidation from '../src/components/DraughtsBoard/integrations/WithMoveValidation';
import UndoMove from '../src/components/DraughtsBoard/integrations/UndoMove';
import RandomVsRandomGame from '../src/components/DraughtsBoard/integrations/RandomVsRandomGame';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
	.add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
	.add('with some emoji', () => (
		<Button onClick={action('clicked')}>
			<span role="img" aria-label="so cool">
				😀 😎 👍 💯
			</span>
		</Button>
	));

storiesOf('DraughtsBoard', module).add('draggable pieces', () => <AllowDragFeature />);

storiesOf('DraughtsBoard', module).add('moves logic', () => <WithMoveValidation />);

storiesOf('DraughtsBoard', module).add('undo move', () => <UndoMove />);

storiesOf('DraughtsBoard', module).add('random move', () => <RandomVsRandomGame />);
