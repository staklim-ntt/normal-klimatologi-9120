document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));

const months=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

const DATA={
  'curah-hujan':{title:'Normal Curah Hujan & Hari Hujan',unit:'Curah Hujan (mm)',a:[394,391,259,88,22,8,2,3,4,22,98,280],aName:'Curah Hujan',b:[23,21,17,9,4,3,1,1,1,3,11,20],bName:'Hari Hujan',dual:true},
  'suhu':{title:'Normal Suhu Bulanan',unit:'Suhu (°C)',a:[31,31,31,33,33,32,32,32,33,33,33,32],aName:'Maksimum',b:[28,27,27,28,27,27,26,26,27,29,29,28],bName:'Rata-rata',c:[25,24,24,24,23,22,22,22,22,24,25,25],cName:'Minimum'},
  'kelembapan':{title:'Normal Kelembapan Udara Bulanan',unit:'Kelembapan Udara (%)',a:[90,90,90,87,82,75,75,73,76,76,82,87],aName:'Maksimum',b:[86,86,86,80,74,71,69,67,69,69,74,83],bName:'Rata-rata',c:[82,60,82,71,67,66,64,61,64,56,68,78],cName:'Minimum'},
  'angin':{title:'Normal Kecepatan Angin Bulanan',unit:'Kecepatan Angin (knot)',a:[9,9,8,9,11,12,13,12,11,11,10,8],aName:'Maksimum rata-rata',b:[4,4,3,4,6,6,7,6,5,5,4,4],bName:'Rata-rata'},
  'penyinaran':{title:'Normal Lama Penyinaran Matahari Bulanan',unit:'Lama Penyinaran Matahari (%)',a:[55,57,68,81,89,90,93,96,96,93,84,61],aName:'Lama Penyinaran Matahari'}
};

function loadPlotly(callback){
  if(window.Plotly){callback();return;}
  const s=document.createElement('script');
  s.src='https://cdn.plot.ly/plotly-2.35.2.min.js';
  s.onload=callback;
  s.onerror=()=>console.error('Plotly gagal dimuat. Periksa koneksi internet.');
  document.head.appendChild(s);
}

function makeChart(id,key){
  const d=DATA[key],el=document.getElementById(id);
  if(!el||!d)return;

  if(el.tagName.toLowerCase()==='canvas'){
    const div=document.createElement('div');
    div.id=id;
    div.style.width='100%';
    div.style.height='430px';
    el.replaceWith(div);
  }

  const chart=document.getElementById(id);
  const traces=[];
  const base={mode:'lines+markers+text',textposition:'top center',hovertemplate:'%{x}<br>%{y}<extra>%{fullData.name}</extra>',line:{width:3},marker:{size:9}};

  if(d.a)traces.push({...base,x:months,y:d.a,name:d.aName,text:d.a.map(String),line:{color:'#1479c9',width:3},marker:{color:'#1479c9',size:9}});
  if(d.b)traces.push({...base,x:months,y:d.b,name:d.bName,text:d.b.map(String),line:{color:'#ed7f25',width:3},marker:{color:'#ed7f25',size:9},yaxis:d.dual?'y2':'y'});
  if(d.c)traces.push({...base,x:months,y:d.c,name:d.cName,text:d.c.map(String),line:{color:'#7058a8',width:3},marker:{color:'#7058a8',size:9}});

  const layout={autosize:true,height:430,margin:{l:58,r:d.dual?68:28,t:28,b:55},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{family:'Inter, Arial, sans-serif',color:'#40566c',size:12},hovermode:'x unified',hoverlabel:{bgcolor:'#fff',font:{color:'#10243a'}},legend:{orientation:'h',y:1.08,x:0,font:{size:12}},xaxis:{title:'Bulan',fixedrange:false,showgrid:false,zeroline:false},yaxis:{title:d.unit,gridcolor:'#dce8f1',zeroline:false},dragmode:'zoom',hoverdistance:20,showlegend:traces.length>1};

  if(d.dual){
    layout.yaxis.title='Curah Hujan (mm)';
    layout.yaxis2={title:'Hari Hujan (hari)',overlaying:'y',side:'right',showgrid:false,zeroline:false};
  }

  Plotly.newPlot(chart,traces,layout,{responsive:true,displaylogo:false,scrollZoom:true,modeBarButtonsToRemove:['lasso2d','select2d'],toImageButtonOptions:{format:'png',filename:'normal-klimatologi-'+key,width:1600,height:900,scale:2}});
}

function initChart(){
  const key=document.body.dataset.chart;
  if(key)loadPlotly(()=>makeChart('chart',key));
}

window.addEventListener('resize',()=>{
  const el=document.getElementById('chart');
  if(window.Plotly&&el&&el.classList.contains('js-plotly-plot'))Plotly.Plots.resize(el);
});
window.addEventListener('load',initChart);
