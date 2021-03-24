import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
  id: number
  image: string
  available: boolean
  name: string
  price: number
  description: string
}

interface FoodTypes {
  image: string
  name: string
  price: number
  description: string
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: FoodTypes) {
    try {
      const { data } = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods(state => [...state, data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: FoodTypes) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      )

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data  
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  } 

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(state => !state);
  }

  function toggleEditModal() {
    setEditModalOpen(state => !state);
  }

  function handleEditFood(food: FoodProps) {
    setEditingFood(food)
    setEditModalOpen(true)
  } 

  return (
    <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  )
}
