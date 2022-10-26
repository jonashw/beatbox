import React from 'react';
import "./Draft2.css";

type Track = {
	name: string,
	audio: HTMLAudioElement,
	slots: boolean[]
}
const beatCount = 8;

const Draft2 = () => {
	const [playing, setPlaying] = React.useState<boolean>(false);
	const [beatInterval,setBeatInterval] = React.useState<NodeJS.Timer>();
	const [activeBeat, setActiveBeat] = React.useState<number|undefined>(undefined);
	const [beatDurationInMS,setBeatDurationInMS] = React.useState<number>(500);
	const [tracks, setTracks] = React.useState<Track[]>([
		{
			name:'kick'   ,
			audio:new Audio("/audio-samples/soft-dirty-lo-fi-hip-hop-kick.wav"),
			slots: [1,0,0,0,1,0,0,1].map(b => b === 1)
		},
		{
			name:'snare-2',
			audio:new Audio("/audio-samples/crispy-snare.wav"),
			slots: [0,0,1,0,0,0,1,0].map(b => b === 1)
		},
		{
			name:'high-hat-closed',
			audio: new Audio("/audio-samples/closed-hat-dry-coarse.wav"),
			slots: [1,1,1,1,1,1,1,1].map(b => b === 1)
		},
		{
			name:'snaps',
			audio: new Audio("/audio-samples/finger-snap-dry-hit_G_minor.wav"),
			slots: [0,0,0,0,0,0,0,0].map(b => b === 1)
		}
	]);

	const stepTheBeat = () => 
		setActiveBeat((ab: number | undefined) => {
			let b = ab === undefined ? 0 : ab + 1;
			if(b >= beatCount){ b = 0 };
			return b;
		});

	React.useEffect(() => {
		if(beatInterval !== undefined){
			clearInterval(beatInterval);
		}
		if(playing){
			setBeatInterval(setInterval(stepTheBeat, beatDurationInMS));
		} else {
			setBeatInterval(undefined);
		}
	}, [playing,beatDurationInMS]);

	const playTracksForActiveBeat = React.useCallback(() => {
		if(activeBeat === undefined){
			console.log('no active beat');
		} else {
			console.log('active beat is now: ' + activeBeat);
			for(let t of tracks){
				if(t.slots[activeBeat]){
					console.log(t.name);
					t.audio.currentTime=0;
					if(t.audio.played){
						t.audio.play();
					}
				}
			}
		}
	}, [activeBeat,tracks]);

	React.useEffect(() => {
		playTracksForActiveBeat();
	}, [activeBeat])

	return <div style={{textAlign:'left', margin:'1em'}}>
		<div style={{marginBottom:'1em'}}>
			<button onClick={() => setPlaying(!playing)}>Pause/Play</button>
			<span style={{display:'inlineBlock','marginLeft':'1em'}}>
				Beat duration
				<input type="range" min="200" max="700"  step={100}
					defaultValue={beatDurationInMS}
					onChange={e => setBeatDurationInMS(parseInt(e.target.value))
				}/> ({beatDurationInMS} ms)
			</span>
		</div>
		{tracks.map((track,trackIndex) => 
			<div key={trackIndex}>
				<span className="track-name">{track.name}</span>
				{track.slots.map((slot,slotIndex) => 
					<span key={slotIndex}
						onClick={() => {
							let updatedSlots = track.slots.map((s,si) => si === slotIndex ? !slot : s);
							let updatedTrack = {...track, slots: updatedSlots};
							setTracks(tracks.map(t => t === track ? updatedTrack : t));
						}}
						className={"slot slot-" + (slot ? "active" : "inactive") + (activeBeat === slotIndex ? " slot-playing" : "")}></span>)}
			</div>)}
	</div>;
}

export default Draft2;