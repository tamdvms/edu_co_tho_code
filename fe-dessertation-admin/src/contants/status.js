export const ACTIVE = 1;
export const PENDING = 0;
export const LOCK = -1;
export const DELETE = -2;

export const renIcon = (id) => {
    switch (id) {
        case ACTIVE: {
            return 'is-active';
        }
        case PENDING: {
            return 'is-pending';
        }
        case LOCK: {
            return 'is-lock';
        }
        case DELETE: {
            return 'is-delete';
        }
    }
}