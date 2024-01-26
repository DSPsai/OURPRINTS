import axios from 'axios';
import cfg from 'cfg';

export const getCoupons =async () => {
   return await axios({
        method: "get",
        url: cfg.baseURL+'/coupon_app/api/coupons/',
        headers:{
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
    }).then(response => {
        console.log(response.data)
        return response.data.results
    }).catch(err => {
        alert("Error Occured while getting coupons")      
    })
}

export const createNewCouponAPI=async(dat)=>{
     return await axios({
          method: dat.isNew?"post":"put",
          url: cfg.baseURL+'/coupon_app/api/coupons/'+(dat.isNew?"":(dat.id+"/")),
          data:  {
            "name": dat.name.value,
            "code": dat.desc.value,
            "discount_percentage": dat.disc.value,
            "valid_from": dat.start.value+'T00:00',
            "valid_to": dat.end.value+'T00:00',
            "one_time_only": dat.isOneTime
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
      }).then(response => {
        alert("Coupon Updated")
      }).catch(err => {
        console.log(err)
        alert("Error Occured while creating coupon, reason : "+JSON.stringify(err.response.data))          
      })
}
export const deleteCoupon=async(dat)=>{
     return await axios({
          method: "delete",
          url: cfg.baseURL+'/coupon_app/api/coupons/'+dat.id+"/",
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
      }).then(response => {
        alert("Coupon Deleted")
        return true
      }).catch(err => {
        alert("Error Occured while creating coupon")          
      })
}

// axios({
//     method: "post",
//     url: '',
//     data: {
//     }
// }).then(response => {
    
// }).catch(err => {
    
// })