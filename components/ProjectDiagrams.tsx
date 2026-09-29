/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';

// One interactive diagram per project/paper. Each is driven by a single small
// gesture (a chip group, a slider, or one button), never autoplays, and logs
// what it is showing in a dark mono "machine" panel underneath.
// Anything not taken from the item's own data is labeled "illustrative".

const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(' ');

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

const Y = ({ children }: { children: React.ReactNode }) => (
    <span className="text-hi">{children}</span>
);

const Frame = ({
    label,
    log,
    children,
}: {
    label: string;
    log: React.ReactNode;
    children: React.ReactNode;
}) => (
    <figure className="border border-ink rounded-[4px] bg-paper p-4 md:p-6 w-full">
        <figcaption className="font-mono text-xs text-ink-2 mb-4">{label}</figcaption>
        {children}
        <div
            className="mt-4 bg-machine text-machine-ink font-mono text-xs md:text-[13px] leading-[1.8] p-4 rounded-[3px] min-h-[84px]"
            aria-live="polite"
        >
            {log}
        </div>
    </figure>
);

const Chips = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: Array<[string, string]>;
    value: string;
    onChange: (v: string) => void;
}) => (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2 mb-4">
        {options.map(([v, text]) => (
            <button
                key={v}
                onClick={() => onChange(v)}
                aria-pressed={value === v}
                className={cx(
                    'min-h-11 px-3.5 font-mono text-[13px] border border-ink rounded-[3px] transition-colors',
                    value === v ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-hi'
                )}
            >
                {text}
            </button>
        ))}
    </div>
);

/** SVG canvas that scrolls sideways on narrow screens instead of shrinking the text. */
const Canvas = ({
    vb,
    label,
    children,
}: {
    vb: string;
    label: string;
    children: React.ReactNode;
}) => (
    <div className="overflow-x-auto">
        <div className="md:hidden font-mono text-xs text-ink-2 mb-2" aria-hidden="true">
            scroll the diagram sideways →
        </div>
        <svg
            viewBox={vb}
            className="w-full min-w-[620px] h-auto block"
            role="img"
            aria-label={label}
        >
            <defs>
                <marker
                    id="arw"
                    markerUnits="userSpaceOnUse"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                >
                    <path d="M0 0L10 5L0 10z" className="fill-ink" />
                </marker>
                <marker
                    id="arwg"
                    markerUnits="userSpaceOnUse"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                >
                    <path d="M0 0L10 5L0 10z" fill="#B9B2A6" />
                </marker>
            </defs>
            {children}
        </svg>
    </div>
);

const Node = ({
    x,
    y,
    w,
    h,
    title,
    sub,
    on,
    muted,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    sub?: string;
    on?: boolean;
    muted?: boolean;
}) => (
    <g>
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={3}
            strokeWidth={1.2}
            strokeDasharray={muted ? '4 3' : undefined}
            className={cx(
                'stroke-ink transition-colors duration-200',
                on ? 'fill-hi' : muted ? 'fill-paper-2' : 'fill-paper'
            )}
        />
        <text
            x={x + w / 2}
            y={y + h / 2 + (sub ? -3 : 4)}
            textAnchor="middle"
            className="font-mono text-[12px] fill-ink"
        >
            {title}
        </text>
        {sub && (
            <text
                x={x + w / 2}
                y={y + h / 2 + 14}
                textAnchor="middle"
                className="font-mono text-[11px] fill-ink-2"
            >
                {sub}
            </text>
        )}
    </g>
);

const Edge = ({ d, on, arrow = true }: { d: string; on?: boolean; arrow?: boolean }) => (
    <path
        d={d}
        fill="none"
        strokeWidth={on ? 2.4 : 1.2}
        markerEnd={arrow ? (on ? 'url(#arw)' : 'url(#arwg)') : undefined}
        className={cx('transition-all duration-200', on ? 'stroke-ink' : 'stroke-[#B9B2A6]')}
    />
);

const Note = ({
    x,
    y,
    children,
    anchor = 'middle',
}: {
    x: number;
    y: number;
    children: React.ReactNode;
    anchor?: 'start' | 'middle' | 'end';
}) => (
    <text x={x} y={y} textAnchor={anchor} className="font-mono text-[11px] fill-ink-2">
        {children}
    </text>
);

const Lines = ({ lines }: { lines: React.ReactNode[] }) => (
    <>
        {lines.map((l, i) => (
            <div key={i}>{l}</div>
        ))}
    </>
);

// ─── TRUSTWORTHYRAG: QALF query router ────────────────────────────────────────

type Route = 'graph' | 'vec' | 'hyb';
const ROUTES: Record<
    Route,
    { chip: string; query: string; complexity: string; intent: string; rule: string; call: string }
> = {
    graph: {
        chip: 'Multi-hop question',
        query: 'Which lab funded the team behind the paper that introduced this method?',
        complexity: '0.91',
        intent: 'multi_hop',
        rule: 'complexity > 0.8 or intent == multi_hop',
        call: 'graph_retriever.query(query)',
    },
    vec: {
        chip: 'Visual lookup',
        query: 'Find the chart that shows Q3 revenue.',
        complexity: '0.42',
        intent: 'visual_lookup',
        rule: 'intent == visual_lookup',
        call: 'multimodal_vector_store.similarity_search(query)',
    },
    hyb: {
        chip: 'Simple fact',
        query: 'When was Neo4j founded?',
        complexity: '0.18',
        intent: 'factual',
        rule: 'else (fallback)',
        call: 'hybrid_retriever.invoke(query)',
    },
};

const RagRouter = () => {
    const [r, setR] = useState<Route>('graph');
    const q = ROUTES[r];
    return (
        <Frame
            label="TRUSTWORTHYRAG · pick a query and watch QALF route it (illustrative queries, routing rules from the project's code)"
            log={
                <Lines
                    lines={[
                        <>query = "{q.query}"</>,
                        <>
                            complexity = {q.complexity} · intent = {q.intent}
                        </>,
                        <>rule: {q.rule}</>,
                        <Y>→ {q.call}</Y>,
                    ]}
                />
            }
        >
            <Chips
                label="Sample query"
                value={r}
                onChange={(v) => setR(v as Route)}
                options={(Object.keys(ROUTES) as Route[]).map((k) => [k, ROUTES[k].chip])}
            />
            <Canvas
                vb="0 0 760 240"
                label="A query passes through a complexity and intent analyzer and is routed to a graph, vector, or hybrid retriever, then to an answer."
            >
                <Edge d="M120 120H165" on />
                <Edge d="M305 120C350 120 370 42 480 42" on={r === 'graph'} />
                <Edge d="M305 120H480" on={r === 'vec'} />
                <Edge d="M305 120C350 120 370 198 480 198" on={r === 'hyb'} />
                <Edge d="M610 42C650 42 650 120 670 120" on={r === 'graph'} arrow={false} />
                <Edge d="M610 120H670" on={r === 'vec'} arrow={false} />
                <Edge d="M610 198C650 198 650 120 670 120" on={r === 'hyb'} arrow={false} />
                <Node x={10} y={98} w={110} h={44} title="Query" on />
                <Node x={165} y={88} w={140} h={64} title="4D complexity" sub="+ intent" on />
                <Node
                    x={480}
                    y={20}
                    w={130}
                    h={44}
                    title="Graph"
                    sub="Neo4j traversal"
                    on={r === 'graph'}
                />
                <Node
                    x={480}
                    y={98}
                    w={130}
                    h={44}
                    title="Vector"
                    sub="image embeddings"
                    on={r === 'vec'}
                />
                <Node
                    x={480}
                    y={176}
                    w={130}
                    h={44}
                    title="Hybrid"
                    sub="keyword + dense"
                    on={r === 'hyb'}
                />
                <Node x={670} y={98} w={80} h={44} title="Answer" on />
            </Canvas>
        </Frame>
    );
};

// ─── AUTOREDTEAM: attacker / target / judge loop ──────────────────────────────

const RT_SCORES = [0.2, 0.5, 0.9];

const RedTeamLoop = () => {
    const [round, setRound] = useState(0);
    const [on, setOn] = useState<string[]>([]);
    const [log, setLog] = useState<React.ReactNode[]>([
        'press "run a round" to start (illustrative run)',
    ]);
    const busy = useRef(false);
    const timers = useRef<number[]>([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const at = (ms: number, fn: () => void) => {
        timers.current.push(window.setTimeout(fn, ms));
    };

    const run = () => {
        if (busy.current) return;
        if (round >= RT_SCORES.length) {
            setRound(0);
            setOn([]);
            setLog(['press "run a round" to start (illustrative run)']);
            return;
        }
        busy.current = true;
        const n = round + 1,
            score = RT_SCORES[round];
        setOn(['n1', 'e1']);
        setLog([<>round {n}</>, <>attacker → sends jailbreak prompt v{n}</>]);
        at(700, () => {
            setOn(['n2', 'e2']);
            setLog((l) => [...l, 'target → responds']);
        });
        at(1400, () => {
            setOn(['n3']);
            setLog((l) => [...l, <>judge → unsafe score {score.toFixed(1)} against the rubric</>]);
        });
        at(2100, () => {
            if (score >= 0.9) {
                setOn(['n1', 'n2', 'n3', 'e1', 'e2']);
                setLog((l) => [...l, <Y>jailbreak found. prompt logged.</Y>]);
            } else {
                setOn(['e3', 'n1']);
                setLog((l) => [...l, 'critique → attacker refines with chain-of-thought']);
            }
            setRound(n);
            busy.current = false;
        });
    };
    const is = (k: string) => on.includes(k);
    return (
        <Frame
            label="AUTOREDTEAM · run the attacker / target / judge loop (scores are illustrative)"
            log={<Lines lines={log} />}
        >
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <button
                    onClick={run}
                    className="min-h-11 px-4 font-mono text-[13px] border border-ink rounded-[3px] bg-ink text-paper hover:bg-hi hover:text-ink transition-colors"
                >
                    {round >= RT_SCORES.length ? 'start over' : 'run a round'}
                </button>
                <span className="font-mono text-xs text-ink-2">round {round}</span>
            </div>
            <Canvas
                vb="0 0 760 200"
                label="The attacker sends a prompt to the target LLM, the judge scores the response, and a critique flows back to the attacker."
            >
                <Edge d="M190 62H295" on={is('e1')} />
                <Edge d="M465 62H570" on={is('e2')} />
                <Edge d="M655 94V160H105V94" on={is('e3')} />
                <Node
                    x={20}
                    y={30}
                    w={170}
                    h={64}
                    title="Attacker"
                    sub="refines the jailbreak"
                    on={is('n1')}
                />
                <Node
                    x={295}
                    y={30}
                    w={170}
                    h={64}
                    title="Target LLM"
                    sub="Gemini · GPT-4 · Llama 3"
                    on={is('n2')}
                />
                <Node
                    x={570}
                    y={30}
                    w={170}
                    h={64}
                    title="Judge"
                    sub="deterministic rubric"
                    on={is('n3')}
                />
                <Note x={380} y={182}>
                    critique in, sharper prompt out
                </Note>
            </Canvas>
        </Frame>
    );
};

// ─── DEEPFAKEGUARD: in-browser vs server ──────────────────────────────────────

const WAVE = {
    real: [
        10, 22, 34, 18, 44, 30, 12, 38, 26, 48, 20, 32, 14, 40, 28, 16, 36, 24, 46, 18, 30, 12, 34,
        22,
    ],
    fake: [
        30, 32, 30, 33, 31, 30, 32, 31, 33, 30, 32, 31, 30, 33, 31, 32, 30, 31, 33, 30, 32, 31, 30,
        32,
    ],
};

const DeepfakeFlow = () => {
    const [sample, setSample] = useState<'real' | 'fake'>('real');
    const [where, setWhere] = useState<'client' | 'server'>('client');
    const p = sample === 'fake' ? 0.94 : 0.06;
    const isFake = p > 0.5;
    return (
        <Frame
            label="DEEPFAKEGUARD · move the model in and out of the browser (probabilities are illustrative)"
            log={
                <Lines
                    lines={[
                        <>
                            {'{'} probability: {p.toFixed(2)}, isFake: {String(isFake)} {'}'}
                        </>,
                        where === 'client' ? (
                            <Y>inference runs in the browser. no audio is uploaded.</Y>
                        ) : (
                            <>audio is uploaded, then a network round trip returns the score.</>
                        ),
                    ]}
                />
            }
        >
            <div className="flex flex-wrap gap-x-8">
                <Chips
                    label="Audio sample"
                    value={sample}
                    onChange={(v) => setSample(v as 'real' | 'fake')}
                    options={[
                        ['real', 'Real voice'],
                        ['fake', 'Cloned voice'],
                    ]}
                />
                <Chips
                    label="Where the model runs"
                    value={where}
                    onChange={(v) => setWhere(v as 'client' | 'server')}
                    options={[
                        ['client', 'In your browser (now)'],
                        ['server', 'On a server (before)'],
                    ]}
                />
            </div>
            <Canvas
                vb="0 0 760 250"
                label="Audio is analysed either entirely inside the browser or uploaded to a server, and a confidence score is shown."
            >
                {where === 'client' && (
                    <>
                        <rect
                            x={168}
                            y={34}
                            width={590}
                            height={182}
                            rx={4}
                            fill="none"
                            strokeWidth={1.2}
                            strokeDasharray="5 4"
                            className="stroke-ink"
                        />
                        <Note x={180} y={54} anchor="start">
                            your browser · audio never leaves the device
                        </Note>
                    </>
                )}
                <rect
                    x={10}
                    y={80}
                    width={130}
                    height={90}
                    rx={3}
                    strokeWidth={1.2}
                    className="fill-paper stroke-ink"
                />
                {WAVE[sample].map((h, i) => (
                    <rect
                        key={i}
                        x={17 + i * 5}
                        y={125 - h / 2}
                        width={3}
                        height={h}
                        className={cx(
                            'transition-all duration-300',
                            sample === 'fake' ? 'fill-ink-2' : 'fill-ink'
                        )}
                    />
                ))}
                {where === 'client' ? (
                    <>
                        <Edge d="M140 125H190" on />
                        <Edge d="M320 125H370" on />
                        <Edge d="M520 125H580" on />
                        <Node
                            x={190}
                            y={95}
                            w={130}
                            h={60}
                            title="Features"
                            sub="spectrogram · MFCC"
                            on
                        />
                        <Node
                            x={370}
                            y={95}
                            w={150}
                            h={60}
                            title="Classifier"
                            sub="Transformers.js"
                            on
                        />
                    </>
                ) : (
                    <>
                        <Edge d="M140 125H190" on />
                        <Edge d="M520 125H580" on />
                        <Node
                            x={190}
                            y={95}
                            w={330}
                            h={60}
                            title="FastAPI service"
                            sub="upload, run the model, send back a score"
                            on
                        />
                        <Note x={355} y={182}>
                            audio leaves the device · network round trip
                        </Note>
                    </>
                )}
                <rect
                    x={580}
                    y={80}
                    width={170}
                    height={90}
                    rx={3}
                    strokeWidth={1.2}
                    className="fill-paper stroke-ink"
                />
                <text
                    x={665}
                    y={104}
                    textAnchor="middle"
                    className="font-mono text-[11px] fill-ink-2"
                >
                    P(fake)
                </text>
                <rect
                    x={596}
                    y={116}
                    width={138}
                    height={14}
                    className="fill-paper-2 stroke-ink"
                    strokeWidth={1}
                />
                <rect
                    x={596}
                    y={116}
                    width={138 * p}
                    height={14}
                    className={cx(
                        'transition-all duration-500',
                        isFake ? 'fill-hi stroke-ink' : 'fill-ink'
                    )}
                    strokeWidth={1}
                />
                <text
                    x={665}
                    y={156}
                    textAnchor="middle"
                    className="font-mono text-[13px] fill-ink"
                >
                    {p.toFixed(2)} · {isFake ? 'likely fake' : 'likely real'}
                </text>
            </Canvas>
        </Frame>
    );
};

// ─── AUTBOT + AUTISM AI: emotion fusion ───────────────────────────────────────

const EMOTIONS = ['frustrated', 'sad', 'neutral', 'happy'] as const;
const EmotionBars = ({ values }: { values: number[] }) => {
    const top = values.indexOf(Math.max(...values));
    return (
        <div
            className="mt-2 grid gap-1.5"
            role="img"
            aria-label={`Illustrative emotion estimate. Highest: ${EMOTIONS[top]}.`}
        >
            {EMOTIONS.map((e, i) => (
                <div
                    key={e}
                    className="grid grid-cols-[88px_1fr] items-center gap-3 font-mono text-xs"
                >
                    <span className={i === top ? 'text-ink' : 'text-ink-2'}>{e}</span>
                    <span className="h-3 bg-paper-2 border border-rule block">
                        <span
                            className={cx(
                                'block h-full transition-all duration-300',
                                i === top ? 'bg-hi border-r border-ink' : 'bg-ink-2/50'
                            )}
                            style={{ width: `${values[i] * 100}%` }}
                        />
                    </span>
                </div>
            ))}
        </div>
    );
};

const FUSION: Record<string, number[]> = {
    both: [0.62, 0.16, 0.14, 0.08],
    speech: [0.48, 0.2, 0.2, 0.12],
    text: [0.18, 0.36, 0.38, 0.08],
};

const AutbotFusion = () => {
    const [mode, setMode] = useState<'both' | 'speech' | 'text'>('both');
    const s = mode !== 'text',
        t = mode !== 'speech';
    return (
        <Frame
            label={
                'AUTBOT · switch the inputs (bars are an illustrative estimate for the line "I can\'t do this", said tensely)'
            }
            log={
                <Lines
                    lines={[
                        <>inputs: {[s && 'speech', t && 'text'].filter(Boolean).join(' + ')}</>,
                        <>
                            reported accuracy: speech <Y>&gt;90%</Y> · text <Y>73%</Y>
                        </>,
                        mode === 'both' ? (
                            <>the fusion layer concatenates both embeddings before the softmax</>
                        ) : (
                            <>one branch alone misses what the other hears</>
                        ),
                    ]}
                />
            }
        >
            <Chips
                label="Inputs"
                value={mode}
                onChange={(v) => setMode(v as 'both' | 'speech' | 'text')}
                options={[
                    ['both', 'Speech + text'],
                    ['speech', 'Speech only'],
                    ['text', 'Text only'],
                ]}
            />
            <Canvas
                vb="0 0 760 250"
                label="A speech spectrogram CNN branch and a DistilRoBERTa text branch are concatenated and passed to a softmax layer that outputs an emotion."
            >
                <Edge d="M170 62H190" on={s} />
                <Edge d="M340 62C380 62 380 125 420 125" on={s} />
                <Edge d="M140 188H190" on={t} />
                <Edge d="M340 188C380 188 380 125 420 125" on={t} />
                <Edge d="M560 125H620" on />
                <Node
                    x={10}
                    y={40}
                    w={130}
                    h={44}
                    title="Speech"
                    sub="128×128 spectrogram"
                    on={s}
                />
                <Node x={190} y={40} w={150} h={44} title="Conv2D" sub="then flatten" on={s} />
                <Node x={10} y={166} w={130} h={44} title="Text" sub="utterance" on={t} />
                <Node
                    x={190}
                    y={166}
                    w={150}
                    h={44}
                    title="DistilRoBERTa"
                    sub="[CLS] embedding"
                    on={t}
                />
                <Node x={420} y={103} w={140} h={44} title="Concatenate" on />
                <Node x={620} y={103} w={130} h={44} title="Dense" sub="softmax" on />
            </Canvas>
            <EmotionBars values={FUSION[mode]} />
        </Frame>
    );
};

const CHILD: Record<string, { chip: string; emo: number[]; reply: string }> = {
    frustrated: {
        chip: 'Child sounds frustrated',
        emo: [0.6, 0.18, 0.14, 0.08],
        reply: 'slow down, simplify the grammar prompt, add encouragement',
    },
    happy: {
        chip: 'Child sounds happy',
        emo: [0.06, 0.06, 0.18, 0.7],
        reply: 'keep the pace, raise the difficulty a step',
    },
    sad: {
        chip: 'Child sounds low',
        emo: [0.12, 0.6, 0.2, 0.08],
        reply: 'use a softer tone, repeat gently, drop the timer',
    },
};

const AutismAdaptive = () => {
    const [c, setC] = useState<'frustrated' | 'happy' | 'sad'>('frustrated');
    const d = CHILD[c];
    return (
        <Frame
            label="AUTISM AI AGENT · pick how the child sounds and see the reply adapt (estimates and replies are illustrative)"
            log={
                <Lines
                    lines={[
                        <>features = hstack(zcr, chroma_stft, mfcc)</>,
                        <>emotion = {c}</>,
                        <Y>→ reply strategy: {d.reply}</Y>,
                    ]}
                />
            }
        >
            <Chips
                label="Child's state"
                value={c}
                onChange={(v) => setC(v as 'frustrated' | 'happy' | 'sad')}
                options={(Object.keys(CHILD) as Array<keyof typeof CHILD>).map((k) => [
                    k,
                    CHILD[k].chip,
                ])}
            />
            <Canvas
                vb="0 0 760 260"
                label="Speech features (zero-crossing rate, chroma, MFCC) are stacked and passed to a CNN, text goes through an NLP model, and both set the emotion that shapes the agent's reply."
            >
                <Edge d="M120 80C150 80 150 29 180 29" on />
                <Edge d="M120 80H180" on />
                <Edge d="M120 80C150 80 150 131 180 131" on />
                <Edge d="M290 29C320 29 320 80 350 80" on />
                <Edge d="M290 80H350" on />
                <Edge d="M290 131C320 131 320 80 350 80" on />
                <Edge d="M460 80H500" on />
                <Edge d="M610 80H700V118" on />
                <Edge d="M120 218H180" on />
                <Edge d="M360 218H700V162" on />
                <Node x={10} y={58} w={110} h={44} title="Speech" sub="librosa" on />
                <Node x={180} y={10} w={110} h={38} title="ZCR" on />
                <Node x={180} y={61} w={110} h={38} title="Chroma" on />
                <Node x={180} y={112} w={110} h={38} title="MFCC" on />
                <Node x={350} y={58} w={110} h={44} title="hstack" sub="feature vector" on />
                <Node x={500} y={58} w={110} h={44} title="CNN" sub="speech emotion" on />
                <Node x={10} y={196} w={110} h={44} title="Text" sub="NLTK" on />
                <Node x={180} y={196} w={180} h={44} title="Text emotion" sub="NLP model" on />
                <Node x={650} y={118} w={100} h={44} title={c} sub="sets the reply" on />
            </Canvas>
            <EmotionBars values={d.emo} />
        </Frame>
    );
};

// ─── FOOD RECOMMENDATION: fuzzy time + temperature ────────────────────────────

const SLOTS: Array<[string, number, number]> = [
    ['Late night', 3.5, 2.2],
    ['Morning', 9.5, 2.0],
    ['Afternoon', 14.5, 1.5],
    ['Evening', 18, 1.2],
    ['Night', 22, 1.5],
];
const gauss = (x: number, mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s));

const FuzzyMenu = () => {
    const [hour, setHour] = useState(8);
    const [temp, setTemp] = useState(6);
    const mem = SLOTS.map(([n, mu, s]) => ({ n, v: gauss(hour, mu, s), mu, s }));
    const top = mem.reduce((a, b) => (b.v > a.v ? b : a));
    const morning = mem[1].v,
        afternoon = mem[2].v;
    const cold = temp <= -10 ? 1 : temp >= 20 ? 0 : temp <= 10 ? 1 : (20 - temp) / 10;
    const hot = temp <= 20 ? 0 : temp >= 30 ? 1 : (temp - 20) / 10;
    const r1 = Math.min(cold, morning),
        r2 = Math.min(hot, afternoon);
    const pick =
        Math.max(r1, r2) < 0.05
            ? null
            : r1 >= r2
              ? 'warm comfort food (e.g. gajar ka halwa)'
              : 'something refreshing';
    const path = (mu: number, s: number) =>
        Array.from({ length: 121 }, (_, i) => {
            const x = i / 5;
            return `${i ? 'L' : 'M'}${(40 + (x / 24) * 690).toFixed(1)} ${(170 - gauss(x, mu, s) * 130).toFixed(1)}`;
        }).join('');
    return (
        <Frame
            label="FUZZY MENU · slide the clock and the thermometer (membership functions and rules from the paper's setup, menu mapping illustrative)"
            log={
                <Lines
                    lines={[
                        <>
                            time {String(Math.floor(hour)).padStart(2, '0')}:
                            {String(Math.round((hour % 1) * 60)).padStart(2, '0')} → {top.n} (
                            {top.v.toFixed(2)}) · {temp}°C → cold {cold.toFixed(2)} · hot{' '}
                            {hot.toFixed(2)}
                        </>,
                        <>
                            cold ∧ morning = {r1.toFixed(2)} · hot ∧ afternoon = {r2.toFixed(2)}
                        </>,
                        <Y>
                            →{' '}
                            {pick
                                ? `recommend ${pick}`
                                : 'no rule fires strongly: show the standard menu'}
                        </Y>,
                    ]}
                />
            }
        >
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-4 font-mono text-xs text-ink-2">
                <label className="block">
                    Hour of day: <span className="text-ink">{hour.toFixed(1)}</span>
                    <input
                        type="range"
                        min={0}
                        max={24}
                        step={0.1}
                        value={hour}
                        onChange={(e) => setHour(parseFloat(e.target.value))}
                        className="w-full accent-ink mt-2 h-6"
                    />
                </label>
                <label className="block">
                    Temperature: <span className="text-ink">{temp}°C</span>
                    <input
                        type="range"
                        min={-10}
                        max={50}
                        step={1}
                        value={temp}
                        onChange={(e) => setTemp(parseInt(e.target.value, 10))}
                        className="w-full accent-ink mt-2 h-6"
                    />
                </label>
            </div>
            <Canvas
                vb="0 0 760 210"
                label="Five Gaussian time-of-day membership curves with a marker at the chosen hour."
            >
                <line x1={40} y1={170} x2={730} y2={170} className="stroke-ink" strokeWidth={1} />
                {mem.map((m) => (
                    <g key={m.n}>
                        <path
                            d={path(m.mu, m.s)}
                            fill="none"
                            strokeWidth={m.n === top.n ? 2.6 : 1.2}
                            className={m.n === top.n ? 'stroke-ink' : 'stroke-[#B9B2A6]'}
                        />
                        <Note x={40 + (m.mu / 24) * 690} y={28}>
                            {m.n}
                        </Note>
                    </g>
                ))}
                <line
                    x1={40 + (hour / 24) * 690}
                    y1={34}
                    x2={40 + (hour / 24) * 690}
                    y2={170}
                    className="stroke-ink"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                />
                <circle
                    cx={40 + (hour / 24) * 690}
                    cy={170 - top.v * 130}
                    r={5}
                    className="fill-hi stroke-ink"
                    strokeWidth={1.5}
                />
                {[0, 6, 12, 18, 24].map((h) => (
                    <Note key={h} x={40 + (h / 24) * 690} y={192}>
                        {String(h).padStart(2, '0')}:00
                    </Note>
                ))}
            </Canvas>
        </Frame>
    );
};

// ─── HEALTHCARE REVIEW: architecture × domain ─────────────────────────────────

const ARCH = [
    {
        k: 'cnn',
        name: 'CNN',
        tag: 'dominant',
        domain: 'Medical imaging',
        dsub: 'X-ray, MRI',
        evidence: '>95% on diabetic retinopathy detection',
        fit: 'best for X-ray and MRI',
    },
    {
        k: 'rnn',
        name: 'RNN / LSTM',
        tag: 'dominant',
        domain: 'Health records',
        dsub: 'EHR, time series',
        evidence: 'patient readmission prediction',
        fit: 'best for EHR and time series',
    },
    {
        k: 'gan',
        name: 'GAN',
        tag: 'emerging',
        domain: 'Drug discovery',
        dsub: 'new molecules',
        evidence: 'molecule generation',
        fit: 'an emerging role',
    },
] as const;

const HealthcareMap = () => {
    const [k, setK] = useState<'cnn' | 'rnn' | 'gan'>('cnn');
    const a = ARCH.find((x) => x.k === k)!;
    const ys = [30, 110, 190];
    return (
        <Frame
            label="HEALTHCARE REVIEW · pick an architecture (findings from the review of 24 papers)"
            log={
                <Lines
                    lines={[
                        <>
                            {a.name} · {a.tag}
                        </>,
                        <>{a.fit}</>,
                        <Y>
                            → {a.domain}: {a.evidence}
                        </Y>,
                    ]}
                />
            }
        >
            <Chips
                label="Architecture"
                value={k}
                onChange={(v) => setK(v as 'cnn' | 'rnn' | 'gan')}
                options={ARCH.map((x) => [x.k, x.name])}
            />
            <Canvas
                vb="0 0 760 270"
                label="Deep learning architectures mapped to the healthcare domain where each performs best."
            >
                {ARCH.map((x, i) => (
                    <g key={x.k}>
                        <Edge d={`M190 ${ys[i] + 28}H570`} on={k === x.k} />
                        <Note x={380} y={ys[i] + 20}>
                            {k === x.k ? x.evidence : ''}
                        </Note>
                        <Node
                            x={10}
                            y={ys[i]}
                            w={180}
                            h={56}
                            title={x.name}
                            sub={x.tag}
                            on={k === x.k}
                        />
                        <Node
                            x={570}
                            y={ys[i]}
                            w={180}
                            h={56}
                            title={x.domain}
                            sub={x.dsub}
                            on={k === x.k}
                        />
                    </g>
                ))}
            </Canvas>
        </Frame>
    );
};

// ─── PM2.5: RMSE by feature-selection method ──────────────────────────────────

const RMSE = [
    { name: 'Pearson', v: 0.525 },
    { name: 'Fisher', v: 0.525 },
    { name: 'Chi-squared', v: 0.533 },
    { name: 'Count-based', v: 0.508 },
];

const Pm25Bars = () => {
    const [sel, setSel] = useState('Count-based');
    const best = Math.min(...RMSE.map((r) => r.v));
    const cur = RMSE.find((r) => r.name === sel)!;
    const delta = cur.v - best;
    return (
        <Frame
            label="PM2.5 · neural network regression RMSE by feature-selection method (lower is better, selected results)"
            log={
                <Lines
                    lines={[
                        <>
                            method = {cur.name} · RMSE = {cur.v.toFixed(3)}
                        </>,
                        delta === 0 ? (
                            <Y>lowest RMSE of the methods shown</Y>
                        ) : (
                            <Y>
                                +{delta.toFixed(3)} vs count-based (+
                                {((delta / best) * 100).toFixed(1)}%)
                            </Y>
                        ),
                    ]}
                />
            }
        >
            <div
                className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-ink-2 mb-5"
                aria-label="Pipeline"
            >
                {[
                    'satellite AOT + weather data',
                    'feature selection',
                    'neural network regression',
                    'daily PM2.5',
                ].map((s, i, arr) => (
                    <React.Fragment key={s}>
                        <span className="px-2 py-1 border border-rule bg-paper-2">{s}</span>
                        {i < arr.length - 1 && <span aria-hidden="true">→</span>}
                    </React.Fragment>
                ))}
            </div>
            <div className="grid gap-2" role="group" aria-label="Select a method">
                {RMSE.map((r) => {
                    const isBest = r.v === best,
                        on = sel === r.name;
                    return (
                        <button
                            key={r.name}
                            onClick={() => setSel(r.name)}
                            aria-pressed={on}
                            className={cx(
                                'grid grid-cols-[104px_1fr_52px] items-center gap-3 min-h-11 px-2 text-left font-mono text-[13px] border transition-colors',
                                on ? 'border-ink bg-paper-2' : 'border-transparent hover:bg-paper-2'
                            )}
                        >
                            <span>{r.name}</span>
                            <span className="h-4 bg-paper-2 border border-rule block">
                                <span
                                    className={cx(
                                        'block h-full border-r border-ink transition-all duration-300',
                                        isBest ? 'bg-hi' : 'bg-ink-2/50'
                                    )}
                                    style={{ width: `${(r.v / 0.6) * 100}%` }}
                                />
                            </span>
                            <span className="text-right">{r.v.toFixed(3)}</span>
                        </button>
                    );
                })}
            </div>
        </Frame>
    );
};

// ─── ROUTER ───────────────────────────────────────────────────────────────────

export const ItemDiagram: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case 'trustworthyrag':
            return <RagRouter />;
        case 'autoredteam':
            return <RedTeamLoop />;
        case 'deepfakeguard':
            return <DeepfakeFlow />;
        case 'autbot':
            return <AutbotFusion />;
        case 'autism-ai':
            return <AutismAdaptive />;
        case 'food-recommendation':
            return <FuzzyMenu />;
        case 'healthcare-dl':
            return <HealthcareMap />;
        case 'pm25-prediction':
            return <Pm25Bars />;
        default:
            return null;
    }
};
