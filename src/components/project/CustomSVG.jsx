/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
const SpriteSVG = "/images/project-linked-sprite.svg";

export const CustomSVG = ({id, color="#00000050", size=20}) => (
    <svg fill={color} width={size} height={size}>
        <use href={`${SpriteSVG}#${id}`} />
    </svg>
);