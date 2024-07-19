import { Popover } from "antd";
import { useMemo, useState } from "react";
import { ChromePicker, ColorChangeHandler } from "react-color";
import { combinations as combinationsData } from "../../assets/_jsons/combinations/combinations.json";
import "./style.scss";
import { averageColor, getContrastColor } from "../../utils";

const LOAD_MORE_LIMIT = 5;

const ColorPalette = () => {
    const [combination, setCombination] = useState(
        combinationsData[0].combination
    );
    const [relatedCombinations, setRelatedCombinations] = useState(
        combinationsData[0].relatedCombinations
    );
    const [currentRelatedCombinations, setCurrentRelatedCombinations] = useState(
        relatedCombinations.slice(0, LOAD_MORE_LIMIT)
    );
    const [combinationColor, setCombinationColor] = useState(
        combination.color.hex
    );

    const isCanSeeMore = useMemo(() => currentRelatedCombinations.length < relatedCombinations.length, [currentRelatedCombinations, relatedCombinations])

    const handleLike = () => {
        setCombination({
            ...combination,
            liked: !combination.liked,
            likes: combination.liked ? combination.likes - 1 : combination.likes + 1,
        });
    };

    const handleSeeMore = () => {
        setCurrentRelatedCombinations(
            relatedCombinations.slice(
                0,
                currentRelatedCombinations.length + LOAD_MORE_LIMIT
            )
        );
    };

    const handleChangeColor =
        (slug: string): ColorChangeHandler =>
            ({ hex }) => {
                const newColors = combination.colors.map((item) =>
                    item.slug === slug ? { ...item, hex } : item
                );
                setCombination({
                    ...combination,
                    colors: newColors,
                });
                setCombinationColor(averageColor(newColors.map((item) => item.hex)));
            };

    const handleCopyColor = (hex: string, slug: string) => {
        navigator.clipboard.writeText(hex);

        const copyIcon = document.getElementById(
            `copy-icon-${slug}`
        ) as HTMLElement;
        copyIcon.style.display = "block";

        const colorItem = document.getElementById(
            `color-item-${slug}`
        ) as HTMLElement;
        colorItem.classList.add("active");

        setTimeout(() => {
            copyIcon.style.display = "none";
            colorItem.classList.remove("active");
        }, 1000);
    };

    const handleOpenRelatedCombination = (id: number) => {
        const item = combinationsData.find((item) => item.combination.id === id);
        if (item) {
            setCombination(item.combination);
            setRelatedCombinations(item.relatedCombinations);
            setCurrentRelatedCombinations(
                item.relatedCombinations.slice(0, LOAD_MORE_LIMIT)
            );
            setCombinationColor(item.combination.color.hex);
            document.documentElement.scrollTop = 0;
        } else {
            console.log(`ID ${id} not found!`);
        }
    };

    return (
        <div className="color-palette">
            <div
                className="color-palette__background"
                style={{
                    backgroundColor: combinationColor,
                }}
            />
            <div className="color-palette__breadcrumb">
                <div>Colors</div>
                <div>{`>`}</div>
                <div>Color Palettes</div>
                <div>{`>`}</div>
                <div className="color-palette__breadcrumb__name">
                    {combination.name}
                </div>
            </div>
            <h1
                className="color-palette__title"
                style={{
                    color: getContrastColor(combinationColor),
                }}
            >
                <span>{combination.name}</span>
                <br />
                <span>color combination</span>
            </h1>
            <div className="color-palette__main">
                <div className="color-palette__main__likes" onClick={handleLike}>
                    <span style={{ color: "red", fontSize: 24 }}>{combination.liked ? "♥" : "♡"}</span>
                    <span>{combination.likes}</span>
                </div>
                <img
                    src={`src/assets/_images/Thumbnail/${combination.featuredImage.url}`}
                    alt={combination.featuredImage.alt}
                    width={900}
                />
                <div className="color-palette__main__colors">
                    {combination.colors.map((color) => (
                        <div
                            key={color.slug}
                            className={`color-palette__main__colors__item`}
                            style={{
                                flex: 1,
                            }}
                        >
                            <div
                                className="color-palette__main__colors__item__color"
                                id={`color-item-${color.slug}`}
                                style={{
                                    backgroundColor: color.hex,
                                }}
                                onClick={() => handleCopyColor(color.hex, color.slug)}
                            >
                                <span className="hover-text">Copy</span>
                                <span className="copy-icon" id={`copy-icon-${color.slug}`}>
                                    ✓
                                </span>
                            </div>
                            <div className="color-palette__main__colors__item__description">
                                <div className="color-palette__main__colors__item__description__name">
                                    {color.name}
                                </div>
                                <Popover
                                    content={
                                        <ChromePicker
                                            color={color.hex}
                                            onChangeComplete={handleChangeColor(color.slug)}
                                        />
                                    }
                                    placement="bottomLeft"
                                >
                                    <div className="color-palette__main__colors__item__description__hex">
                                        {color.hex}
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <h1 className="color-palette__second-title">Related Combinations</h1>
            <div className="color-palette__related">
                {currentRelatedCombinations.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="color-palette__related__item"
                            onClick={() => handleOpenRelatedCombination(item.id)}
                        >
                            <div className="color-palette__related__item__colors">
                                {item.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="color-palette__related__item__colors__color"
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <div className="color-palette__related__item__description">
                                <span className="color-palette__related__item__description__name">
                                    {item.name}
                                </span>
                                <div className="color-palette__related__item__description__likes">
                                    <span style={{ color: "red", marginRight: 10, fontSize: 24 }}>
                                        {item.liked ? "♥" : "♡"}
                                    </span>
                                    <span>{combination.likes}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isCanSeeMore && (
                    <div
                        className="color-palette__related__see-more"
                        onClick={handleSeeMore}
                    >
                        See more combinations
                    </div>
                )}
            </div>
            <h1 className="color-palette__third-title">
                Use this color palette and create beautiful designs and documents!
            </h1>
            <div className="color-palette__browse-btn">Browse templates</div>
        </div>
    );
};

export default ColorPalette;
