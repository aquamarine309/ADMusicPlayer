import CodeMirror from "../modules/codemirror/lib/codemirror.js";
import Decimal from "../modules/break_infinity.js";
import Vue from "../modules/vue.js";
import { MIDI } from "../modules/MIDI/midi/synesthesia.js";

import "../modules/codemirror/addon/mode/simple.js";
import "../modules/codemirror/addon/hint/show-hint.js";
import "../modules/codemirror/addon/lint/lint.js";
import "../modules/codemirror/addon/selection/active-line.js";
import "../modules/codemirror/addon/edit/closebrackets.js";

import "../modules/MIDI/midi/audioDetect.js";
import "../modules/MIDI/midi/gm.js";
import "../modules/MIDI/midi/loader.js";
import "../modules/MIDI/midi/plugin.audiotag.js";
import "../modules/MIDI/midi/plugin.webaudio.js";
import "../modules/MIDI/midi/plugin.webmidi.js";
import "../modules/MIDI/util/dom_request_xhr.js";
import "../modules/MIDI/util/dom_request_script.js";

window.CodeMirror = CodeMirror;
window.Decimal = Decimal;
window.Vue = Vue;
window.MIDI = MIDI;