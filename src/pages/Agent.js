import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import SettingsModal from '../components/SettingsModal';
import { runAgentStreamApi } from '../utils/api_calls';
import './Agent.css';

const initialPanels = {
    input: false,
    stream: false,
    details: false
};

const parseSseBlock = (block) => {
    const lines = block.split('\n').map((line) => line.trimEnd());
    let eventName = 'message';
    const dataLines = [];

    lines.forEach((line) => {
        if (line.startsWith('event:')) {
            eventName = line.slice('event:'.length).trim();
        } else if (line.startsWith('data:')) {
            dataLines.push(line.slice('data:'.length).trimStart());
        }
    });

    const rawData = dataLines.join('\n');
    let parsedData = rawData;

    if (rawData) {
        try {
            parsedData = JSON.parse(rawData);
        } catch (error) {
            parsedData = rawData;
        }
    }

    return {
        event: eventName,
        data: parsedData,
        raw: rawData
    };
};

const Agent = () => {
    const navigate = useNavigate();
    const { isEnglish, toggleLanguage, t } = useLanguage();
    const { getAuthHeader } = useAuth();
    const [showSettings, setShowSettings] = useState(false);
    const [selectedPhase, setSelectedPhase] = useState(1);
    const [emailText, setEmailText] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);
    const [streamEvents, setStreamEvents] = useState([]);
    const [collapsedPanels, setCollapsedPanels] = useState(initialPanels);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handlePasteFromClipboard = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setEmailText(clipboardText);
        } catch (clipboardError) {
            setError('Unable to read the clipboard.');
        }
    };

    const appendStreamEvent = (entry) => {
        setStreamEvents((current) => [...current, {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            timestamp: new Date().toISOString(),
            ...entry
        }]);
    };

    const handlePhaseChange = (phase) => {
        setSelectedPhase(phase);
    };

    const handleTogglePanel = (panelKey) => {
        setCollapsedPanels((current) => ({
            ...current,
            [panelKey]: !current[panelKey]
        }));
    };

    const handleRunAgent = async () => {
        if (!emailText.trim()) {
            setError('Paste or type the email text before running the agent.');
            return;
        }

        setIsRunning(true);
        setError(null);
        setStreamEvents([]);

        try {
            const authHeader = getAuthHeader();
            const response = await runAgentStreamApi({
                phaseNumber: selectedPhase,
                emailText,
                authHeader
            });

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(responseText || `Agent request failed with status ${response.status}`);
            }

            if (!response.body) {
                throw new Error('Streaming response body is empty.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

                let separatorIndex = buffer.indexOf('\n\n');
                while (separatorIndex !== -1) {
                    const block = buffer.slice(0, separatorIndex).trim();
                    buffer = buffer.slice(separatorIndex + 2);

                    if (block) {
                        const entry = parseSseBlock(block);
                        appendStreamEvent(entry);

                        if (entry.event === 'error') {
                            setError(typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data));
                        }
                    }

                    separatorIndex = buffer.indexOf('\n\n');
                }

                if (done) {
                    break;
                }
            }

            if (buffer.trim()) {
                const entry = parseSseBlock(buffer.trim());
                appendStreamEvent(entry);
            }
        } catch (runError) {
            setError(runError?.message || 'Failed to run the agent.');
        } finally {
            setIsRunning(false);
        }
    };

    const renderStreamEntry = (entry) => JSON.stringify({
        event: entry.event,
        timestamp: entry.timestamp,
        data: entry.data
    }, null, 2);

    return (
        <div className="agent-page">
            <div className="agent-top-nav">
                <div className="nav-left">
                    <button className="nav-btn back-btn expanded" onClick={handleBack}>
                        <span className="btn-icon">←</span>
                        <span className="btn-text">{t('back')}</span>
                    </button>
                </div>

                <div className="nav-middle">
                    <h2 className="page-title">AI Agent</h2>
                </div>

                <div className="nav-right">
                    <div className="language-toggle">
                        <button
                            className={`language-option ${!isEnglish ? 'active' : ''}`}
                            onClick={() => !isEnglish || toggleLanguage()}
                        >
                            IT
                        </button>
                        <button
                            className={`language-option ${isEnglish ? 'active' : ''}`}
                            onClick={() => isEnglish || toggleLanguage()}
                        >
                            EN
                        </button>
                        <div className={`language-slider ${isEnglish ? 'en' : 'it'}`}></div>
                    </div>

                    <button
                        className="nav-btn settings-btn expanded"
                        onClick={() => setShowSettings(true)}
                    >
                        <span className="btn-icon">⚙️</span>
                        <span className="btn-text">{t('settings')}</span>
                    </button>
                </div>
            </div>

            <div className="agent-content">
                <div className="agent-panels">
                    {/* Input Panel */}
                    <section className={`agent-panel ${collapsedPanels.input ? 'collapsed' : ''}`}>
                        <div className="agent-panel-header">
                            <h3>Input</h3>
                            <button className="panel-toggle-btn" onClick={() => handleTogglePanel('input')}>
                                {collapsedPanels.input ? '▸' : '◂'}
                            </button>
                        </div>

                        {!collapsedPanels.input && (
                            <div className="agent-panel-body">
                                <div className="phase-selector">
                                    {[1, 2, 3].map((phase) => (
                                        <label key={phase} className={`phase-option ${selectedPhase === phase ? 'active' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPhase === phase}
                                                onChange={() => handlePhaseChange(phase)}
                                            />
                                            <span>Phase {phase}</span>
                                        </label>
                                    ))}
                                </div>

                                <label className="text-area-label" htmlFor="agent-email-text">
                                    Email Text
                                </label>
                                <div className="agent-textarea-shell">
                                    <textarea
                                        id="agent-email-text"
                                        className="agent-textarea"
                                        value={emailText}
                                        onChange={(event) => setEmailText(event.target.value)}
                                        placeholder="Paste the email text here..."
                                        disabled={isRunning}
                                    />
                                    <button
                                        type="button"
                                        className="agent-action-btn secondary paste-btn"
                                        onClick={handlePasteFromClipboard}
                                    >
                                        Paste from Clipboard
                                    </button>
                                </div>

                                <div className="agent-run-footer">
                                    <button
                                        className="agent-action-btn primary run-agent-btn"
                                        onClick={handleRunAgent}
                                        disabled={isRunning}
                                    >
                                        {isRunning ? 'Running...' : 'Run Agent'}
                                    </button>
                                </div>

                                {error && <div className="agent-error">{error}</div>}
                            </div>
                        )}
                    </section>

                    {/* Stream Panel */}
                    <section className={`agent-panel ${collapsedPanels.stream ? 'collapsed' : ''}`}>
                        <div className="agent-panel-header">
                            <h3>Stream</h3>
                            <button className="panel-toggle-btn" onClick={() => handleTogglePanel('stream')}>
                                {collapsedPanels.stream ? '▸' : '◂'}
                            </button>
                        </div>

                        {!collapsedPanels.stream && (
                            <div className="agent-panel-body scrollable">
                                <div className="stream-meta">Live JSON updates from the backend</div>
                                <div className="stream-log">
                                    {streamEvents.length === 0 ? (
                                        <div className="stream-placeholder">No streamed events yet.</div>
                                    ) : (
                                        streamEvents.map((entry) => (
                                            <pre key={entry.id} className="stream-entry">
                                                {renderStreamEntry(entry)}
                                            </pre>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Details Panel */}
                    <section className={`agent-panel ${collapsedPanels.details ? 'collapsed' : ''}`}>
                        <div className="agent-panel-header">
                            <h3>Details</h3>
                            <button className="panel-toggle-btn" onClick={() => handleTogglePanel('details')}>
                                {collapsedPanels.details ? '▸' : '◂'}
                            </button>
                        </div>

                        {!collapsedPanels.details && (
                            <div className="agent-panel-body scrollable">
                                <div className="stream-meta">Secondary view for streamed payloads</div>
                                <div className="stream-log compact">
                                    {streamEvents.length === 0 ? (
                                        <div className="stream-placeholder">Waiting for backend stream...</div>
                                    ) : (
                                        streamEvents.slice().reverse().map((entry) => (
                                            <pre key={entry.id} className="stream-entry compact-entry">
                                                {renderStreamEntry(entry)}
                                            </pre>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
};

export default Agent;