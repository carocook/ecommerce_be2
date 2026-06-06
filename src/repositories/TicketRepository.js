import { ticketModel } from "../model/ticketModel.js";

class TicketRepository {
  async create(ticketData) {
    return await ticketModel.create(ticketData);
  }

  async getById(id) {
    return await ticketModel.findById(id);
  }

  async getAll() {
    return await ticketModel.find();
  }
}

export default new TicketRepository();
