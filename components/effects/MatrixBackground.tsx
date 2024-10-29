'use client';

import { useEffect, useRef } from 'react';

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    // 设置画布大小为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix效果的字符
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // 每列字符的Y坐标
    const drops: number[] = [];
    for (let i = 0; i < columns; ) {
      drops[i] = 1;
      i += 1;
    }

    const draw = () => {
      // 设置半透明黑色背景,产生渐变消失的效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置文字颜色和字体
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      // 逐列绘制字符
      for (let i = 0; i < drops.length; ) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 字符到达底部或随机重置位置
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
        i += 1;
      }
    };

    // 动画循环
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className='fixed inset-0 -z-10 opacity-25' />;
}

export default MatrixBackground;
