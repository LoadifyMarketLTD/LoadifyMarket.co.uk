const PDFDocument = require('pdfkit');
exports.handler = async (event) => {
  try{
    const { orderId, total=0, email='' } = JSON.parse(event.body||'{}');
    const doc = new PDFDocument({ size:'A4', margin:50 });
    let chunks=[];
    doc.on('data', c=>chunks.push(c));
    doc.on('end', ()=>{});
    doc.fontSize(18).text('Loadify Market — Invoice', { align:'left' });
    doc.moveDown().fontSize(12).text(`Order: ${orderId}`);
    doc.text(`Customer: ${email}`);
    doc.text(`Total: £${(total/100).toFixed(2)}`);
    doc.end();
    await new Promise(r=>doc.on('end', r));
    const pdf = Buffer.concat(chunks).toString('base64');
    return { statusCode:200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pdfBase64: pdf }) };
  }catch(e){ return { statusCode:500, body: JSON.stringify({ error:e.message }) }; }
}
