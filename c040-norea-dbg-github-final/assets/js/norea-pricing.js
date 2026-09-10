'use strict';
const form=document.querySelector('.norea-filters');
if(form){
 const rows=[...document.querySelectorAll('.norea-detail-table tbody tr')];
 const type=document.getElementById('norea-type'),status=document.getElementById('norea-status'),floor=document.getElementById('norea-floor');
 function filter(){
  let count=0,sold=0;
  rows.forEach(row=>{const visible=(!type.value||row.dataset.type===type.value)&&(!status.value||row.dataset.status===status.value)&&(!floor.value||row.dataset.floor===floor.value);row.hidden=!visible;if(visible){count++;if(row.dataset.status==='Sold')sold++;}});
  document.getElementById('norea-results').textContent=count+' units · '+sold+' sold';
  document.getElementById('norea-empty').hidden=count!==0;
 }
 form.addEventListener('change',filter);
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('reset',()=>setTimeout(filter,0));
 filter();
}

