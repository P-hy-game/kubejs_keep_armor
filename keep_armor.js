const ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack")
const NbtUtils = Java.loadClass("net.minecraft.nbt.NbtUtils")
const EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot');

// Save armor on death
EntityEvents.death(event => {
  const entity = event.entity
  if (entity.isPlayer()) {
    // Use armorSlots, an array of 4 ItemStacks
    // console.log(entity)
    // console.log(entity.uuid.toString())
    // console.log(entity.getArmorSlots())

    const armorItems = {
      feet: entity.getArmorSlots()[0],
      legs: entity.getArmorSlots()[1],
      chest: entity.getArmorSlots()[2],
      head: entity.getArmorSlots()[3]
    };
    for (let slot of EquipmentSlot.values()) {
      console.log(slot, slot.getType(), slot.getName())
      if (slot.getType() === EquipmentSlot.Type.ARMOR) {
        // const item = entity.getItemBySlot(slot); There seems to be issue with kubejs assigning const in for loop
        // armorItems[slot.getName()] = item;
        entity.setItemSlot(slot, ItemStack.EMPTY); // Remove armor to prevent dropping
      }
    }
    console.log(armorItems)
    entity.persistentData.put("armorBackup", armorItems)

  }
})

// Restore armor after respawn
PlayerEvents.respawned(event => {
  const player = event.player
  const armor = player.persistentData.get("armorBackup") ?? null
  console.log(player.uuid.toString())
  if (!armor) { 
    return; 
  }

  // Assign back to armorSlots
  for (let slot of EquipmentSlot.values()) {
    if (slot.getType() === EquipmentSlot.Type.ARMOR) {
      if (armor[slot.getName().toString()]) {
        player.setItemSlot(slot, ItemStack.of(armor[slot.getName().toString()]));
      }
    }
  }
  
  player.persistentData.remove("armorBackup") 

})
