var H5ComponentPolyline = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	var w = cfg.width;
	var h = cfg.height;

	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);
	// 水平网格
	var step = 10;
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#AAAAAA";

	for(var i = 0; i < step + 1; i++) {
		var y = (h / step) * i;
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
	}

	// 垂直网格线（根据项目的个数）
	step = cfg.data.length + 1;
	for(var i = 0; i < step + 1; i ++) {
		var x = (w / step) * i;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);

		if(cfg.data[i]) {
			var text = $('<div class="text">');
			text.text(cfg.data[i][0]);
			var text_w = w / step >> 0;
			text.css('width', text_w / 2).css('left', (x/2 - text_w/4) + text_w/2);
			component.append(text);
		}
	}

	ctx.stroke();

	// 绘制折线，分成两层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	function draw(per) {
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "red";

		var x = 0;
		var y = 0;
		var row_w = w / (cfg.data.length + 1);
		// 画点
		for(var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i];
			x = row_w * (i + 1);
			y = h * (1 - item[1]*per);
			ctx.moveTo(x, y);
			ctx.arc(x, y, 5, 0, 2*Math.PI);
		}

		// 连线
		ctx.moveTo(row_w, h * (1 - cfg.data[0][1]*per));
		for(var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i];
			x = row_w * (i + 1);
			y = h * (1 - item[1]*per);
			ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0)';

		// 阴影
		ctx.lineTo(x, h);
		ctx.lineTo(row_w, h);
		ctx.fillStyle = 'rgba(255, 118, 118, 0.37)';
		ctx.fill();

		// 写数据
		for(var i = 0; i < cfg.data.length; i++) {
			var item = cfg.data[i];
			x = row_w * (i + 1);
			y = h * (1 - item[1]*per);
			ctx.fillStyle = item[2] ? item[2] : '#595959'
			ctx.fillText((item[1] * 100) + '%', x - 10, y - 10);
		}

		ctx.stroke();
	}

	// 动画效果
	var t = 0;
	component.on('onLoad', function() {
		var timer = requestAnimationFrame(function update() {
			if(t >= 1) {
				cancelAnimationFrame(timer);
			} else {
				t = t + 0.02;
				draw(t);
				requestAnimationFrame(update);
			}
		});
	});

	component.on('onLeave', function() {
		var timer = requestAnimationFrame(function update() {
			if(t <= 0) {
				cancelAnimationFrame(timer);
			} else {
				t = t - 0.02;
				draw(t);
				requestAnimationFrame(update);
			}
		});
	});
	return component;
}