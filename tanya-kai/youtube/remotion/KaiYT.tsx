import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {useFonts} from '../Kit';
import cues from './cues_kai.json';
import {introSvg, outroSvg, comboSvg} from './scenesKai';

// Intro & outro YouTube Tanya Kai. Komposisi 1920×1080, render scale 4/3 (2560×1440).
const Frame: React.FC<{kind: 'intro' | 'outro' | 'combo'}> = ({kind}) => {
  useFonts();
  const t = useCurrentFrame() / 30;
  const svg = kind === 'intro' ? introSvg(t, cues) : kind === 'combo' ? comboSvg(t, cues) : outroSvg(t, cues);
  return (
    <AbsoluteFill style={{background: '#8b7bff'}}>
      <Audio src={staticFile(`mix_kai_${kind}.wav`)} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{fontFamily: 'Pop'}} dangerouslySetInnerHTML={{__html: svg}} />
    </AbsoluteFill>
  );
};
export const KaiIntroYT: React.FC = () => <Frame kind="intro" />;
export const KaiOutroYT: React.FC = () => <Frame kind="outro" />;
export const KaiComboYT: React.FC = () => <Frame kind="combo" />;
