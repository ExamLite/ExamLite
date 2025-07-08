const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let devices = [];
let draggingDevice = null;
let selectedDevice = null;
let cableMode = false;
let deleteMode = false;
let hoveredLink = null;
let editMode = false;

function addDevice(type) {
  const x = Math.random() * 600 + 50;
  const y = Math.random() * 400 + 50;
  const label = type + ' ' + (devices.length + 1);
  const ports = ['eth0', 'eth1', 'eth2'];

  devices.push({
    x, y,
    width: 100,
    height: 50,
    type,
    label,
    ports,
    links: [],
    dragOffsetX: 0,
    dragOffsetY: 0
  });

  drawDevices();
}

function drawDevices() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  devices.forEach(device => {
    ctx.fillStyle = device.type === 'Router' ? '#61dafb' : '#7FDBB6';
    ctx.fillRect(device.x, device.y, device.width, device.height);
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText(device.label, device.x + 10, device.y + 30);
  });

  const drawn = new Set();
  devices.forEach(device => {
    device.links.forEach(link => {
      const key = [device.label, link.target.label].sort().join('→');
      if (drawn.has(key)) return;
      drawn.add(key);

      const source = device;
      const target = link.target;

      const dx = target.x + target.width / 2 - (source.x + source.width / 2);
      const dy = target.y + target.height / 2 - (source.y + source.height / 2);

      let x1 = source.x + source.width / 2;
      let y1 = source.y + source.height / 2;
      if (Math.abs(dx) > Math.abs(dy)) {
        x1 = dx > 0 ? source.x + source.width : source.x;
      } else {
        y1 = dy > 0 ? source.y + source.height : source.y;
      }

      let x2 = target.x + target.width / 2;
      let y2 = target.y + target.height / 2;
      if (Math.abs(dx) > Math.abs(dy)) {
        x2 = dx > 0 ? target.x : target.x + target.width;
      } else {
        y2 = dy > 0 ? target.y : target.y + target.height;
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (
        hoveredLink &&
        hoveredLink.source.label === source.label &&
        hoveredLink.target.label === target.label &&
        hoveredLink.sourcePort === link.sourcePort &&
        hoveredLink.targetPort === link.targetPort
      ) {
        const length = Math.hypot(x2 - x1, y2 - y1);
        const ux = (x2 - x1) / length;
        const uy = (y2 - y1) / length;
        const offset = 28;
        const sx = x1 + ux * offset;
        const sy = y1 + uy * offset;
        const tx = x2 - ux * offset;
        const ty = y2 - uy * offset;

        ctx.fillStyle = '#000';
        ctx.font = '12px monospace';
        ctx.fillText(link.sourcePort, sx, sy);
        ctx.fillText(link.targetPort, tx, ty);
      }
    });
  });
}

canvas.addEventListener('mousedown', e => {
  const { offsetX, offsetY } = e;
  for (let device of devices) {
    if (
      offsetX >= device.x && offsetX <= device.x + device.width &&
      offsetY >= device.y && offsetY <= device.y + device.height
    ) {
      draggingDevice = device;
      device.dragOffsetX = offsetX - device.x;
      device.dragOffsetY = offsetY - device.y;
      return;
    }
  }
});

canvas.addEventListener('mousemove', e => {
  const { offsetX, offsetY } = e;

  if (draggingDevice) {
    draggingDevice.x = offsetX - draggingDevice.dragOffsetX;
    draggingDevice.y = offsetY - draggingDevice.dragOffsetY;
  }

  hoveredLink = null;
  const seen = new Set();

  for (let device of devices) {
    for (let link of device.links) {
      const cableKey = [device.label, link.target.label].sort().join("→");
      if (seen.has(cableKey)) continue;
      seen.add(cableKey);

      const dx = link.target.x + link.target.width / 2 - (device.x + device.width / 2);
      const dy = link.target.y + link.target.height / 2 - (device.y + device.height / 2);

      let x1 = device.x + device.width / 2;
      let y1 = device.y + device.height / 2;
      if (Math.abs(dx) > Math.abs(dy)) {
        x1 = dx > 0 ? device.x + device.width : device.x;
      } else {
        y1 = dy > 0 ? device.y + device.height : device.y;
      }

      let x2 = link.target.x + link.target.width / 2;
      let y2 = link.target.y + link.target.height / 2;
      if (Math.abs(dx) > Math.abs(dy)) {
        x2 = dx > 0 ? link.target.x : link.target.x + link.target.width;
      } else {
        y2 = dy > 0 ? link.target.y : link.target.y + link.target.height;
      }

      const dxLine = x2 - x1;
      const dyLine = y2 - y1;
      const lenSq = dxLine * dxLine + dyLine * dyLine;
      const t = ((offsetX - x1) * dxLine + (offsetY - y1) * dyLine) / lenSq;

      if (t > 0 && t < 1) {
        const px = x1 + t * dxLine;
        const py = y1 + t * dyLine;
        const dist = Math.hypot(offsetX - px, offsetY - py);
        if (dist < 6) {
          hoveredLink = {
            source: device,
            target: link.target,
            sourcePort: link.sourcePort,
            targetPort: link.targetPort
          };
          break;
        }
      }
    }
    if (hoveredLink) break;
  }

  drawDevices();
});

canvas.addEventListener('mouseup', () => {
  draggingDevice = null;
});

function toggleCableMode() {
  cableMode = !cableMode;
  deleteMode = false;
  selectedDevice = null;
  document.getElementById('cableBtn').style.backgroundColor = cableMode ? '#ffd966' : '#444';
  document.getElementById('cableBtn').innerText = cableMode ? '✅ Select 2 Devices' : '🔌 Cable Mode';
  document.getElementById('deleteBtn').style.backgroundColor = '#444';
  document.getElementById('deleteBtn').innerText = '🗑️ Delete Mode';
  drawDevices();
}

function toggleDeleteMode() {
  deleteMode = !deleteMode;
  cableMode = false;
  selectedDevice = null;
  document.getElementById('deleteBtn').style.backgroundColor = deleteMode ? '#ff9e9e' : '#444';
  document.getElementById('deleteBtn').innerText = deleteMode ? '🗑️ Click to Delete' : '🗑️ Delete Mode';
  document.getElementById('cableBtn').style.backgroundColor = '#444';
  document.getElementById('cableBtn').innerText = '🔌 Cable Mode';
  drawDevices();
}

canvas.addEventListener('click', e => {
  const { offsetX, offsetY } = e;

  // 🔥 DELETE MODE
  if (deleteMode) {
    // Try to delete a cable first
    for (let device of devices) {
      for (let i = device.links.length - 1; i >= 0; i--) {
        const link = device.links[i];
        const dx = link.target.x + link.target.width / 2 - (device.x + device.width / 2);
        const dy = link.target.y + link.target.height / 2 - (device.y + device.height / 2);

        let x1 = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? device.x + device.width : device.x)
          : device.x + device.width / 2;
        let y1 = Math.abs(dx) > Math.abs(dy)
          ? device.y + device.height / 2
          : (dy > 0 ? device.y + device.height : device.y);

        let x2 = Math.abs(dx) > Math.abs(dy)
          ? (dx > 0 ? link.target.x : link.target.x + link.target.width)
          : link.target.x + link.target.width / 2;
        let y2 = Math.abs(dx) > Math.abs(dy)
          ? link.target.y + link.target.height / 2
          : (dy > 0 ? link.target.y : link.target.y + link.target.height);

        const dxLine = x2 - x1;
        const dyLine = y2 - y1;
        const lenSq = dxLine * dxLine + dyLine * dyLine;
        const t = ((offsetX - x1) * dxLine + (offsetY - y1) * dyLine) / lenSq;

        if (t > 0 && t < 1) {
          const px = x1 + t * dxLine;
          const py = y1 + t * dyLine;
          const dist = Math.hypot(offsetX - px, offsetY - py);
          if (dist < 6) {
            if (confirm("Delete this cable?")) {
              const other = link.target;
              device.links.splice(i, 1);
              other.links = other.links.filter(l => l.target !== device);
              drawDevices();
              return;
            }
          }
        }
      }
    }

    // Then try to delete a device
    for (let i = devices.length - 1; i >= 0; i--) {
      const d = devices[i];
      if (
        offsetX >= d.x && offsetX <= d.x + d.width &&
        offsetY >= d.y && offsetY <= d.y + d.height
      ) {
        if (confirm(`Delete ${d.label} and all its connections?`)) {
          d.links.forEach(link => {
            link.target.links = link.target.links.filter(l => l.target !== d);
          });
          devices.splice(i, 1);
          drawDevices();
          return;
        }
      }
    }

    return;
  }

  // ✏️ EDIT MODE
  if (editMode) {
    for (let device of devices) {
      if (
        offsetX >= device.x && offsetX <= device.x + device.width &&
        offsetY >= device.y && offsetY <= device.y + device.height
      ) {
        const newLabel = prompt("Edit label:", device.label);
        if (newLabel !== null && newLabel.trim() !== '') {
          device.label = newLabel.trim();
          drawDevices();
        }
        return;
      }
    }
    return;
  }

  // 🔌 CABLE MODE
  if (cableMode) {
    const clicked = devices.find(d =>
      offsetX >= d.x && offsetX <= d.x + d.width &&
      offsetY >= d.y && offsetY <= d.y + d.height
    );

    if (clicked) {
      showPortPopup(clicked, offsetX, offsetY);
    }

    return;
  }
});


function showPortPopup(device, x, y) {
  const popup = document.getElementById('port-popup');
  const select = document.getElementById('portSelect');
  select.innerHTML = '';

  const usedPorts = device.links.map(link => link.sourcePort);

  device.ports.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.text = usedPorts.includes(p) ? `${p} (in use)` : p;
    opt.disabled = usedPorts.includes(p);
    select.appendChild(opt);
  });

  popup.style.left = (canvas.offsetLeft + x) + 'px';
  popup.style.top = (canvas.offsetTop + y) + 'px';
  popup.style.display = 'block';
  popup.dataset.deviceIndex = devices.indexOf(device);
}

function confirmPortSelection() {
  const popup = document.getElementById('port-popup');
  const select = document.getElementById('portSelect');
  const port = select.value;
  const deviceIndex = parseInt(popup.dataset.deviceIndex);
  const device = devices[deviceIndex];
  popup.style.display = 'none';

  if (!selectedDevice) {
    selectedDevice = { device, port };
  } else {
    const first = selectedDevice;
    const second = { device, port };

    const exists = first.device.links.some(link =>
      link.target === second.device &&
      link.sourcePort === first.port &&
      link.targetPort === second.port
    );

    if (!exists) {
      first.device.links.push({
        target: second.device,
        sourcePort: first.port,
        targetPort: second.port
      });

      second.device.links.push({
        target: first.device,
        sourcePort: second.port,
        targetPort: first.port
      });
    }

    selectedDevice = null;
    cableMode = false;
    const cableBtn = document.getElementById('cableBtn');
    cableBtn.style.backgroundColor = '#444';
    cableBtn.innerText = '🔌 Cable Mode';
    drawDevices();
  }
}

function toggleEditMode() {
  editMode = !editMode;
  cableMode = false;
  deleteMode = false;
  selectedDevice = null;

  document.getElementById('editBtn').style.backgroundColor = editMode ? '#ffd966' : '#444';
  document.getElementById('cableBtn').style.backgroundColor = '#444';
  document.getElementById('deleteBtn').style.backgroundColor = '#444';

  document.getElementById('cableBtn').innerText = '🔌 Cable Mode';
  document.getElementById('deleteBtn').innerText = '🗑️ Delete Mode';

  drawDevices();
}

function saveTopology() {
  const sanitized = devices.map(d => ({
    x: d.x,
    y: d.y,
    width: d.width,
    height: d.height,
    type: d.type,
    label: d.label,
    ports: [...d.ports],
    links: d.links.map(link => ({
      targetLabel: link.target.label,
      sourcePort: link.sourcePort,
      targetPort: link.targetPort
    }))
  }));

  const name = prompt("Enter filename:", "topology.json");
  if (!name) return;

  const data = JSON.stringify(sanitized, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = name.endsWith('.json') ? name : name + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function loadTopology(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const rawData = JSON.parse(e.target.result);

      devices = rawData.map(d => ({
        x: d.x,
        y: d.y,
        width: d.width,
        height: d.height,
        type: d.type,
        label: d.label,
        ports: [...d.ports],
        links: [],
        dragOffsetX: 0,
        dragOffsetY: 0
      }));

      rawData.forEach((original, i) => {
        original.links.forEach(link => {
          const targetDevice = devices.find(d => d.label === link.targetLabel);
          if (targetDevice) {
            devices[i].links.push({
              target: targetDevice,
              sourcePort: link.sourcePort,
              targetPort: link.targetPort
            });
          }
        });
      });

      drawDevices();
    } catch (err) {
      alert("Failed to load topology: " + err.message);
    }
  };

  reader.readAsText(file);
}
