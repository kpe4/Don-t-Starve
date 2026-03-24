// Функция для рисования вертикальных искр
window.drawVerticalSparks = function(ctx, x, y) {
    // TODO: Две жёлтые линии: вверх и вниз от точки
    // Толщина линий: 2px
    // 👇 Твой код здесь
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    
    // Вверх
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20);
    ctx.stroke();
    
    // Вниз
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 20);
    ctx.stroke();
}
