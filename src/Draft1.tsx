import React from 'react';
const Draft1 = () => {
	const [microphoneState, setMicrophoneState] = React.useState<PermissionState>('prompt');
	const [recordings, setRecordings] = React.useState<string[]>([]);
	const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | undefined>(undefined);
	const [mediaRecorderState, setMediaRecorderState] = React.useState<RecordingState>("inactive");

	React.useEffect(() => {
		navigator.permissions.query({ name: 'microphone' as PermissionName }).then(function (result) {
			const respondToState = (state: PermissionState) => {
				console.log('Microphone permission state: ' + state);
				switch (state) {
					case 'granted': break;
					case 'prompt': break;
					case 'denied': break;
					default: console.error('unexpected state: ' + state);
				}
				setMicrophoneState(state);
			};
			result.onchange = () => respondToState(result.state);
			respondToState(result.state);
		});
	}, []);

	React.useEffect(() => {
		const handleSuccess = function (stream: MediaStream) {
			const options = { mimeType: 'audio/webm' };
			const recordedChunks: Blob[] = [];
			const mediaRecorder = new MediaRecorder(stream, options);
			setMediaRecorder(mediaRecorder);

			mediaRecorder.addEventListener('dataavailable', function (e) {
				if (e.data.size > 0) {
					recordedChunks.push(e.data);
					console.log('recorder data', e.data);
				}
			});

			mediaRecorder.addEventListener('stop', function () {
				let href = URL.createObjectURL(new Blob(recordedChunks));
				setRecordings(rs => [...rs, href]);
			});
		};

		navigator.mediaDevices.getUserMedia({ audio: true, video: false })
			.then(handleSuccess)
			.catch(console.error);
	}, [])

	const [muteState, setMuteState] = React.useState<{ [ix: number]: boolean }>({});
	return <div>
		{microphoneState}
		<button
			onClick={() => {
				if (!mediaRecorder) {
					return;
				} else {
					mediaRecorder.start();
					setMediaRecorderState(mediaRecorder.state);
				}
			}}
			disabled={microphoneState !== "granted" || mediaRecorderState === "recording"}>Start Recording</button>
		<button
			onClick={() => {
				if (!mediaRecorder) {
					return;
				} else {
					mediaRecorder.stop();
					setMediaRecorderState(mediaRecorder.state);
				}
			}}
			disabled={microphoneState !== "granted" || mediaRecorderState !== "recording"}>Stop Recording</button>
		{recordings.map((r, i) =>
			<div>
				<button onClick={() => {
					setMuteState({ ...muteState, [i]: !muteState[i] });
				}}>
					{!!muteState[i] ? "🔈" : "🔊"}
				</button>
				#{i + 1}
				{!muteState[i] &&
					<audio src={r} autoPlay={true} loop={true} />
				}
				<a href={r} download={"track" + i + ".wav"}>Download</a>
			</div>
		)}
	</div>;
}

export default Draft1;