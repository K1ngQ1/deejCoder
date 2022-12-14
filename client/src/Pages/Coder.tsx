import { useState } from "react";
import { Link } from "react-router-dom";
import ArduinoOutput from "../components/coder/ArduinoOutput";
import ConfigYaml from "../components/coder/configYaml";
import { useCodeContext } from "../hooks/useCodeContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Coder() {
    //context to receive information over the whole app
    const { user } = useAuthContext();
    const { dispatch } = useCodeContext();
    //state for arduino code output
    const [sliderCount, setSliderCount] = useState(3);
    const [codeName, setCodeName] = useState("");
    //array to save to the user input analog pin location.
    let analogIdIn = Array.from(Array(sliderCount), (e, i) => {
        return `A${i}`;
    });
    const [analogId, setAnalogId] = useState(analogIdIn);

    //state for config file output
    const [comPort, setComPort] = useState<string>("");
    const [configNoise, setConfigNoise] = useState<string>("");
    const [invertSlider, setInvertSlider] = useState<string>("");

    //const array for config file slider_mapping
    let sliderArray = Array.from(Array(sliderCount), (e, i) => {
        return ``;
    });
    const [sliderConfig, setSliderConfig] = useState(sliderArray);

    //trigger function to apply changes to the analog pins array in die code component
    const [trigger, setTrigger] = useState(true);
    const triggerFunc = () => {
        setTrigger(!trigger);
    };

    //error
    const [error, setError] = useState("");

    //project save button
    const saveTemplate = {
        codeName,
        sliderCount,
        analogId: analogId.slice(0, sliderCount),
        sliderConfig,
        comPort,
        configNoise,
        invertSlider,
    };
    //async function to send fetch request to server to create new code block, also resets the state and updates dispatch
    const saveProject = async () => {
        if (!user) {
            setError("You must be logged in");
            return;
        }

        const response = await fetch("/api/code", {
            method: "POST",
            body: JSON.stringify(saveTemplate),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });
        const json = await response.json();
        //error catch
        if (!response.ok) {
            setError(json.error);
        }

        if (response.ok) {
            //updates dispatch, keeps state in sync with server
            dispatch({ type: "CREATE_CODE", payload: json });
            //set all state to default
            setSliderCount(0);
            setAnalogId([]);
            setSliderConfig([]);
            setCodeName("");
            setComPort("");
            setConfigNoise("");
            setInvertSlider("");
            setError("");
            //alert to let user know code has been saved
            alert("new code added");
            //console.log for debugging onsave
            console.log("new code added", saveTemplate);
        }
    };

    return (
        <div className="artboard bg-base-200 rounded-xl border border-solid border-accent p-4 w-8/12 mb-2">
            <h1 className="text-5xl">deejCoder:</h1>
            <br />
            <br />
            <h1 className="text-3xl">Arduino File Setup:</h1>
            <br />
            <h2>Project Name:</h2>
            <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary w-full max-w-xs"
                value={codeName}
                onChange={(e) => {
                    setCodeName(e.target.value);
                }}
            />
            <br />
            <br />
            <h2>How many knobs/sliders?</h2>
            <input
                type="range"
                min="0"
                max="8"
                className="range range-secondary"
                step="1"
                value={sliderCount}
                onChange={async (e) => {
                    await setSliderCount(e.target.valueAsNumber);
                }}
            />
            <div className="w-full flex justify-between text-xs px-2">
                {Array.from(Array(9), (e, i) => {
                    return <span key={i}>{i}</span>;
                })}
            </div>
            <br />
            <div>
                <h2>What analog pins are the knobs connected to?</h2>
                <br />
                {Array.from(Array(sliderCount), (e, i) => {
                    return (
                        <>
                            <> slider {i + 1}:</>
                            <select
                                className="select m-1 select-secondary"
                                key={i}
                                onChange={(e) => {
                                    analogId.splice(i, 1, e.target.value);
                                }}
                            >
                                <option>Select Pin</option>
                                {Array.from(Array(11), (e, i) => {
                                    return (
                                        <option key={`pin${i}`} value={`A${i}`}>
                                            A{i}
                                        </option>
                                    );
                                })}
                            </select>
                        </>
                    );
                })}
                <button
                    className="btn btn-outline btn-secondary"
                    onClick={() => {
                        triggerFunc();
                    }}
                >
                    Apply
                </button>
            </div>
            <br />
            <ArduinoOutput
                sliderCount={sliderCount}
                analogId={analogId.slice(0, sliderCount)}
            />
            <br />
            <br />
            <h1 className="text-3xl">Config File Setup:</h1>
            <br />
            <div className="columns-4">
                {Array.from(Array(sliderCount), (e, i) => {
                    return (
                        <div>
                            {" "}
                            slider {i + 1}:{" "}
                            <select
                                className="select  select-secondary m-1  max-w-lg"
                                key={i}
                                onChange={(e) => {
                                    sliderConfig.splice(i, 1, e.target.value);
                                }}
                            >
                                <option value={`select action`}>
                                    Select Action
                                </option>
                                <option value={`${i}: master`}>master</option>
                                <option value={`${i}: mic`}>mic</option>
                                <option value={`${i}: deej.unmapped`}>
                                    Unmapped Apps
                                </option>
                                <option value={`${i}: system`}>
                                    System Sounds
                                </option>
                                <option value={`${i}: **.exe`}>
                                    Application
                                </option>
                            </select>
                        </div>
                    );
                })}
            </div>
            <br />
            <div className="column-3 p-1 m-2">
                Invert Sliders:{" "}
                <select
                    className="select select-secondary m-1"
                    onChange={(e) => setInvertSlider(e.target.value)}
                >
                    <option value="">Select Option</option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
                COM Port:{" "}
                <select
                    className="select select-secondary m-1"
                    onChange={(e) => setComPort(e.target.value)}
                >
                    <option value="">Select Option</option>
                    {Array.from(Array(13), (e, i) => {
                        return (
                            <option value={i} key={`com${i}`}>
                                {i}
                            </option>
                        );
                    })}
                </select>
                Noise Reduction:{" "}
                <select
                    className="select select-secondary m-1"
                    onChange={(e) => setConfigNoise(e.target.value)}
                >
                    <option value="">Select Option</option>
                    <option value="low">Low</option>
                    <option value="default">Default</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button
                className="btn btn-secondary btn-outline btn-wide"
                onClick={() => {
                    triggerFunc();
                }}
            >
                Apply
            </button>
            <br />
            <ConfigYaml
                trigger={trigger}
                sliderCount={sliderCount}
                sliderConfig={sliderConfig}
                comPort={comPort}
                configNoise={configNoise}
                invertSlider={invertSlider}
            />
            <br />
            <br />
            {/* button bottom of page for save or login prompt */}
            {user && (
                <button className="btn btn-secondary" onClick={saveProject}>
                    Save Project
                </button>
            )}{" "}
            {!user && (
                <div className="alert bg-secondary shadow-lg">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current flex-shrink-0 w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>
                            Please note to save project you have to be logged
                            in!
                        </span>
                        <div className="flex-none">
                            <Link to="/login">
                                <button className="btn btn-sm btn-primary">
                                    Login Page
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
