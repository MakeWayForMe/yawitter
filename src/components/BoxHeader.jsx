export const BoxHeader = ({yaweetObj, yaweetStyle}) => {
    return (
        <div className={yaweetStyle.insideProfile}>
            <img src={yaweetObj.photoURL} alt="프로필이미지" />
            <h2 className={yaweetStyle.writer}>{yaweetObj.displayName}</h2>
        </div>
    );
}