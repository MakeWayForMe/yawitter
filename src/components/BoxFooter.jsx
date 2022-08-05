import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrashCan, faPencil } from "@fortawesome/free-solid-svg-icons";

export const BoxFooter = ({editing, yaweetStyle, editOn, editOff, onDeleteClick}) => {
    return (
        <div className={yaweetStyle.editRemove}>
            { editing ? (
                    <button type="button" onClick={editOff}><FontAwesomeIcon icon={faXmark} /></button>
                ) : (
                    <>
                    <button type="button" onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashCan} /></button>
                    <button type="button" onClick={editOn}><FontAwesomeIcon icon={faPencil} /></button>
                    </>
                )
            }
        </div>
    );
}