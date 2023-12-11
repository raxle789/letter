const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080]
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ width, height }) => {
	const cell = 20;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	typeCanvas.width = cols;
	typeCanvas.height = rows;

	return ({ context, width, height }) => {
		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols * 1.2;

		typeContext.fillStyle = 'white';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		typeContext.textBaseline = 'top';
		
		const metrics = typeContext.measureText(text);
		const mx = metrics.actualBoundingBoxLeft * -1;
		const my = metrics.actualBoundingBoxAscent * -1;
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		
		const tx = (cols - mw) * 0.5 - mx;
		const ty = (rows - mh) * 0.5 - my;
		
		typeContext.save();
		typeContext.translate(tx, ty);
		
		typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();
		
		typeContext.fillText(text, 0, 0);
		typeContext.restore();

		const typeData = typeContext.getImageData(0, 0, cols, rows).data;

		context.fillStyle = '#171e65';
		context.fillRect(0, 0, width, height);

		context.textBaseline = 'middle';
		context.textAlign = 'center';


		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			// const color = ['#E19898', '#A2678A', '#4D3C77', '#3F1D38'];
			const color = ['#004225', '#F5F5DC', '#FFB000', '#FFCF9D'];

			if (r === 0 && g === 0 && b === 0) {
				context.fillStyle = '#171e65';
				// context.fillStyle = color[Math.floor(Math.random() * color.length)];
				// context.fillStyle = color[Math.floor(Math.random() * color.length)];
			} else {
				context.fillStyle = color[Math.floor(Math.random() * color.length)];
				// context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
				// context.fillStyle = 'white';
			}

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);
			context.beginPath();
			context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
			context.fill();
			context.restore();
		}
	};
};

const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

document.addEventListener('keyup', onKeyUp);

const start = async () => {
	manager = await canvasSketch(sketch, settings);
};

start();
