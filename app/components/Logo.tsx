import * as React from "react";

const SvgIcon = ({ fill = "#002538", size = 56 }: { fill?: string; size?: number }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 56 56"
	>
		<title>Logo</title>
		<rect width="8" height="6" x="22" y="20" fill={fill} rx="2" />
		<rect width="7" height="20" x="12" y="20" fill={fill} rx="2" />
		<rect width="20" height="11" x="22" y="29" fill={fill} rx="2" />
		<rect width="9" height="15" x="33" y="11" fill={fill} rx="2" />
		<rect width="18" height="6" x="12" y="11" fill={fill} rx="2" />
		<rect width="9" height="39" y="11" fill={fill} rx="2" />
		<rect width="30" height="13" x="12" y="43" fill={fill} rx="2" />
		<rect width="11" height="42" x="45" y="5" fill={fill} rx="2" />
		<rect width="36" height="8" x="6" fill={fill} rx="2" />
	</svg>
);

export default SvgIcon;
