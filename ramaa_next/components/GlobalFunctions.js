



// HIDING FOOTER AREA
export const hideFooter = () => {

	if (typeof document === 'undefined') {
	return
	}

	const footerDom = document.getElementById("footer_wrapper")
	footerDom.style.display = 'none'
}




// SHOWING FOOTER AREA
export const showFooter = () => {

	if (typeof document === 'undefined') {
	return
	}
	  
	const footerDom = document.getElementById("footer_wrapper")
	footerDom.style.display = ''
}



