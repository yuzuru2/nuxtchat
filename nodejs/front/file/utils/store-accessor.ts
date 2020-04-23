import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import Room from '~/store/room';

let RoomStore: Room;

function initialiseStores(store: Store<any>): void {
  RoomStore = getModule(Room, store);
}

export { initialiseStores, RoomStore };
