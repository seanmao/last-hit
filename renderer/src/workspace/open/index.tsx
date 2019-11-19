import { ipcRenderer, remote } from 'electron';
import React from 'react';
import styled from 'styled-components';
import { getActiveWorkspace } from '../../active';
import { closeCurrentWorkspace } from '../../files';
import BottomBar from './bottom-bar';
import MainContent from './main-content';

const onBeforeUnload = (evt: BeforeUnloadEvent) => {
	remote.dialog
		.showMessageBox(remote.getCurrentWindow(), {
			type: 'question',
			title: 'Close workspace',
			message: 'Are you sure to close current workspace?',
			buttons: ['OK', 'Cancel']
		})
		.then((ret: Electron.MessageBoxReturnValue) => {
			if (ret.response === 0) {
				// ok clicked
				window.onbeforeunload = null;
				ipcRenderer.send('workspace-closed', getActiveWorkspace()!.getSettings().name);
				closeCurrentWorkspace();
			}
		});
	evt.returnValue = false;
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
`;

export default (): JSX.Element => {
	React.useEffect(() => {
		window.onbeforeunload = onBeforeUnload;
		return () => {
			window.onbeforeunload = null;
		};
	});

	return (
		<Container>
			<MainContent />
			<BottomBar />
		</Container>
	);
};
