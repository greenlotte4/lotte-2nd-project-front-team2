/* eslint-disable react/prop-types */

export const CustomSVG = ({id, color="#00000050", size=20}) => (
    <svg fill={color} width={size} height={size} className="ico">
        <use href={`/images/project-linked-sprite.svg#${id}`} />
    </svg>
);