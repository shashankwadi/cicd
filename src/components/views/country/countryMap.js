
import images from 'assets/images';


export function countryImage(countryCode) {

if(countryCode == "sa") {


return images.saIcon;
} else if(countryCode == "ae") {

return images.uaeIcon;
} else if(countryCode == "ba") {
return images.bahrainIcon;
} else if(countryCode == "ku") {
return images.kuwaitIcon;
} else if(countryCode == "le") {
return images.lebanonIcon;
} else if(countryCode == "om") {
return images.omanIcon;
} else if(countryCode == "qa") {
return images.qatarIcon;
} 
}
