class CommandsController < ApplicationController
  def create
    new_command = Command.new(command_params)
    new_command.save
    @commands = Command.all
  end

  def destroy
    command = Command.find(params[:id])
    command.destroy
    @commands = Command.all
  end

  private

  def command_params
    params.require(:command).permit(:keywords, :response, :description)
  end
end
