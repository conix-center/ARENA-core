window.addEventListener('onauth', function(e) {
    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        boxSelectionEnabled: false,

        style: [{
            selector: 'node',
            style: {
                'content': 'data(id)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'font-family' : 'Courier',
                'text-outline-width': 0.5
            }
        }, {
            selector: 'node[class="client"]',
            style: {
                'content': function(elem) {
                    let additional_info = "";
                    if (elem.data('latency') !== null && elem.data('latency') !== undefined) {
                        additional_info = "\n(" + elem.data('latency') + " ms)";
                    }
                    return elem.data('id') + additional_info;
                },
                "font-size": 3.5,
                'shape': 'round-rectangle',
                'background-color': 'Coral',
                'text-outline-color': 'Coral'
            }
        }, {
            selector: 'node[class="topic"]',
            style: {
                "font-size": 3.5,
                'shape': 'ellipse',
                'background-color': 'LightBlue',
                'text-outline-color': 'LightBlue'
            }
        }, {
            selector: 'node[class="ip"]',
            style: {
                "font-size": 4.0,
                'shape': 'barrel',
                'background-color': '#9e9199',
                'text-outline-color': '#9e9199'
            }
        }, {
            selector: ':parent',
            style: {
                'text-valign': 'bottom',
                'text-halign': 'center',
                'text-margin-y': -5
            }
        }, {
            selector: 'edge',
            style: {
                'content': function(elem) {
                    return elem.data('bps') + " bytes/s";
                },
                "font-size": 3.5,
                'width': 1.0,
                'arrow-scale': 0.5,
                'font-family' : 'Courier',
                'line-color': 'LightGray',
                'target-arrow-color': 'LightGray',
                'curve-style': 'bezier',
                // 'text-rotation': 'autorotate',
                'target-arrow-shape': 'triangle-backcurve',
                'text-outline-width': 0.5,
                'text-outline-color': 'LightGray'
            }
        }]
    });

    let prevJSON = [];
    let currIdx = 0;

    let spinner = document.querySelector(".refreshSpinner");
    let uptodate = document.getElementById("uptodate");

    let pauseBtn = document.getElementById("pause");
    let spinnerUpdate = true;
    let paused = false;

    function init() {
        let brokerAddr;
        if (ARENADefaults && ARENADefaults.mqttHost) { // prefer deployed custom config
            brokerAddr = `wss://${ARENADefaults.mqttHost}${ARENADefaults.mqttPath[0]}`;
        }
        window.client = new Paho.MQTT.Client(brokerAddr, "graphViewer-" + (+new Date).toString(36));
        window.graphTopic = ARENADefaults.graphTopic;
        window.latencyTopic = window.graphTopic + "/latency";

        window.client.onConnectionLost = onConnectionLost;
        window.client.onMessageArrived = onMessageArrived;

        window.client.connect({
            onSuccess: onConnect,
            userName: e.detail.mqtt_username,
            password: e.detail.mqtt_token,
        });
    }
    init();

    function onConnect() {
        console.log("Connected!");
        window.client.subscribe(window.graphTopic);
        publish(window.client, window.latencyTopic, "", 2);
        setInterval(() => {
            publish(window.client, window.latencyTopic, "", 2);
        }, 10000);
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
        spinner.style.display = "none";
        uptodate.style.display = "block";
        uptodate.innerText = "Connection lost. Refresh to try again.";
        client.connect({
            onSuccess: onConnect,
            userName: e.detail.mqtt_username,
            password: e.detail.mqtt_token,
        });
    }

    function publish(client, dest, msg, qos) {
        let message = new Paho.MQTT.Message(msg);
        message.destinationName = dest;
        message.qos = qos;
        client.send(message);
    }

    function runLayout() {
        cy.layout({
            name: 'fcose',
            padding: 10,
            randomize: true,
            fit: true,
            animate: true,
            packComponents: true,
            nodeRepulsion: 4500,
            idealEdgeLength: 50,
            tile: true,
            tilingPaddingVertical: 10,
            tilingPaddingHorizontal: 10,
            animationDuration: 300,
            animationEasing: 'ease-out'
        }).run();
    }

    function createCyJSON(json) {
        let res = [];
        let cnt = 0;
        for (let i = 0; i < json["ips"].length; i++) {
            let ip = json["ips"][i]
            let ipJSON = {};
            ipJSON["data"] = {};
            ipJSON["data"]["id"] = ip["id"];
            ipJSON["data"]["class"] = "ip";
            ipJSON["group"] = "nodes";
            res.push(ipJSON);

            for (let j = 0; j < ip["clients"].length; j++) {
                let client = ip["clients"][j];
                let clientJSON = {};
                clientJSON["data"] = {};
                clientJSON["data"]["id"] = client["name"];
                clientJSON["data"]["latency"] = client["latency"];
                clientJSON["data"]["class"] = "client";
                clientJSON["data"]["parent"] = ip["id"];
                clientJSON["group"] = "nodes";
                res.push(clientJSON);

                for (let k = 0; k < client["published"].length; k++) {
                    let pubEdge = client["published"][k];
                    let pubEdgeJSON = {};
                    pubEdgeJSON["data"] = {};
                    pubEdgeJSON["data"]["id"] = "edge_"+(cnt++);
                    pubEdgeJSON["data"]["bps"] = pubEdge["bps"];
                    pubEdgeJSON["data"]["source"] = client["name"];
                    pubEdgeJSON["data"]["target"] = pubEdge["topic"];
                    pubEdgeJSON["group"] = "edges";
                    res.push(pubEdgeJSON);
                }
            }
        }

        for (i = 0; i < json["topics"].length; i++) {
            let topic = json["topics"][i];
            let topicJSON = {};
            topicJSON["data"] = {};
            topicJSON["data"]["id"] = topic["name"];
            topicJSON["data"]["class"] = "topic";
            topicJSON["group"] = "nodes";
            res.push(topicJSON);

            for (j = 0; j < topic["subscriptions"].length; j++) {
                let subEdge = topic["subscriptions"][j];
                let subEdgeJSON = {};
                subEdgeJSON["data"] = {};
                subEdgeJSON["data"]["id"] = "edge_"+(cnt++);
                subEdgeJSON["data"]["bps"] = subEdge["bps"];
                subEdgeJSON["data"]["source"] = topic["name"];
                subEdgeJSON["data"]["target"] = subEdge["client"];
                subEdgeJSON["group"] = "edges";
                res.push(subEdgeJSON);
            }
        }
        return res;
    }

    function updateCy(json) {
        try {
            let cyJSON = createCyJSON(json);
            cy.json({ elements: cyJSON });
            runLayout();
        }
        catch (err) {
            console.log(err.message);
            console.log(JSON.stringify(json, undefined, 2));
        }
    }

    function onMessageArrived(message) {
        var newJSON = JSON.parse(message.payloadString);

        if (!paused) updateCy(newJSON);
        prevJSON.push(newJSON);
        if (!paused) currIdx = prevJSON.length;

        spinner.style.display = "none";
        uptodate.style.display = "block";
        if (!paused) {
            spinnerUpdate = false;
            setTimeout(() => {
                spinner.style.display = "block";
                uptodate.style.display = "none";
                spinnerUpdate = true;
            }, 2000);
        }
    }

    function timer() {
        if (spinnerUpdate) {
            if (paused) {
                pauseBtn.innerHTML = "&#9658;";
                spinner.style.display = "none";
                uptodate.style.display = "block";
            }
            else {
                pauseBtn.innerHTML = "&#10074;&#10074;";
                spinner.style.display = "block";
                uptodate.style.display = "none";
            }
        }
        requestAnimationFrame(timer);
    }
    timer();

    pauseBtn.addEventListener("click", function() {
        paused = !paused;
        if (currIdx != prevJSON.length-1) {
            currIdx = prevJSON.length-1;
            updateCy(prevJSON[currIdx]);
        }
    });

    document.getElementById("forward").addEventListener("click", function() {
        paused = true;
        let prevIdx = currIdx;
        currIdx++;
        if (currIdx >= prevJSON.length) {
            currIdx = prevJSON.length-1;
            paused = false;
        }
        if (prevIdx != currIdx) {
            updateCy(prevJSON[currIdx]);
        }
    });

    document.getElementById("reverse").addEventListener("click", function() {
        paused = true;
        let prevIdx = currIdx;
        currIdx--;
        if (currIdx < 0) {
            currIdx = 0;
        }
        if (prevIdx != currIdx) {
            updateCy(prevJSON[currIdx]);
        }
    });

    // cy.on("tap", "node", function(event) {
    //     let obj = event.target;
    //     let tapped_node = cy.$id(obj.id()).data();
    //     console.log(tapped_node["id"]);
    // });
});
