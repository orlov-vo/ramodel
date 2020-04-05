[ramodel](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Variables

* [get](_index_.md#const-get)

### Functions

* [combineLenses](_index_.md#combinelenses)
* [createModel](_index_.md#createmodel)
* [destroy](_index_.md#destroy)
* [makeLense](_index_.md#makelense)
* [watch](_index_.md#watch)

## Variables

### `Const` get

• **get**: *idx* = idx

## Functions

###  combineLenses

▸ **combineLenses**<**Result**, **R1**>(`lenses`: [L‹R1›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

**Parameters:**

▪ **lenses**: *[L‹R1›]*

▪ **handler**: *function*

▸ (`v1`: R1): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**>(`lenses`: [L‹R1›, L‹R2›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**, **R6**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**, **R9**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

▪ **R9**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8, `v9`: R9): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |
`v9` | R9 |

**Returns:** *L‹Result›*

▸ **combineLenses**<**Result**, **R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**, **R9**, **R10**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›, L‹R10›], `handler`: function): *L‹Result›*

**Type parameters:**

▪ **Result**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

▪ **R9**

▪ **R10**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›, L‹R10›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8, `v9`: R9, `v10`: R10): *Result*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |
`v9` | R9 |
`v10` | R10 |

**Returns:** *L‹Result›*

___

###  createModel

▸ **createModel**<**Init**, **Public**>(`run`: function): *ModelClass‹Init, Public›*

Create a new model

**Type parameters:**

▪ **Init**: *object*

▪ **Public**: *object*

**Parameters:**

▪ **run**: *function*

Function with Hooks should return the public state and methods

▸ (`init`: Init): *Public*

**Parameters:**

Name | Type |
------ | ------ |
`init` | Init |

**Returns:** *ModelClass‹Init, Public›*

Class for creating a model instance

___

###  destroy

▸ **destroy**(...`instances`: unknown[]): *void*

Shutdown all side effects and clean the state in models instances

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...instances` | unknown[] | List of instances  |

**Returns:** *void*

___

###  makeLense

▸ **makeLense**<**T**, **R**>(`rootModel`: T, `selector`: Accessor‹T, R›): *Lense‹R›*

**Type parameters:**

▪ **T**: *BaseModel*

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`rootModel` | T |
`selector` | Accessor‹T, R› |

**Returns:** *Lense‹R›*

___

###  watch

▸ **watch**<**R1**>(`lenses`: [L‹R1›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

**Parameters:**

▪ **lenses**: *[L‹R1›]*

▪ **handler**: *function*

▸ (`v1`: R1): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**>(`lenses`: [L‹R1›, L‹R2›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**, **R6**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**, **R9**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

▪ **R9**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8, `v9`: R9): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |
`v9` | R9 |

**Returns:** *UnsubscribeFn*

▸ **watch**<**R1**, **R2**, **R3**, **R4**, **R5**, **R6**, **R7**, **R8**, **R9**, **R10**>(`lenses`: [L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›, L‹R10›], `handler`: function): *UnsubscribeFn*

**Type parameters:**

▪ **R1**

▪ **R2**

▪ **R3**

▪ **R4**

▪ **R5**

▪ **R6**

▪ **R7**

▪ **R8**

▪ **R9**

▪ **R10**

**Parameters:**

▪ **lenses**: *[L‹R1›, L‹R2›, L‹R3›, L‹R4›, L‹R5›, L‹R6›, L‹R7›, L‹R8›, L‹R9›, L‹R10›]*

▪ **handler**: *function*

▸ (`v1`: R1, `v2`: R2, `v3`: R3, `v4`: R4, `v5`: R5, `v6`: R6, `v7`: R7, `v8`: R8, `v9`: R9, `v10`: R10): *void*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | R1 |
`v2` | R2 |
`v3` | R3 |
`v4` | R4 |
`v5` | R5 |
`v6` | R6 |
`v7` | R7 |
`v8` | R8 |
`v9` | R9 |
`v10` | R10 |

**Returns:** *UnsubscribeFn*
