import ReactGA from "react-ga";

export const initGA = (trackingID) => {           
    ReactGA.initialize(trackingID); 
 }

//  'UA-163688296-1'

 export const PageView = () => {  
    ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
}

//Can also add a numerical value to an event...
export const Event = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
  };