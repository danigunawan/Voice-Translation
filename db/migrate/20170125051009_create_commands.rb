class CreateCommands < ActiveRecord::Migration[5.0]
  def change
    create_table :commands do |t|
      t.string :keywords
      t.string :response
      t.string :language

      t.timestamps
    end
  end
end
