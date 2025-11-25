// Patch для исправления кнопки "Назад" в многоуровневой форме
// Добавьте этот скрипт после загрузки main.js

document.addEventListener('DOMContentLoaded', () => {
  // Переопределяем обработчик кнопки "Назад"
  const originalRenderFinalFields = window.showFinalFields;

  window.showFinalFields = function(opt) {
    // Вызываем оригинальную функцию
    if (originalRenderFinalFields) {
      originalRenderFinalFields.call(this, opt);
    }

    // Переопределяем обработчик кнопки "Назад"
    setTimeout(() => {
      const finalFields = document.getElementById("finalFields");
      const backBtn = finalFields?.querySelector("[data-back='true']");

      if (backBtn) {
        // Удаляем старый обработчик
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);

        // Добавляем новый обработчик
        newBackBtn.addEventListener("click", () => {
          console.log('BACK BUTTON CLICKED!');
          finalFields.style.display = "none";

          // Получаем путь из глобальной переменной
          const selectedPath = window.selectedPath || [];
          console.log('selectedPath before pop:', selectedPath);
          selectedPath.pop();
          console.log('selectedPath after pop:', selectedPath);
          console.log('selectedPath.length:', selectedPath.length);

          if (selectedPath.length === 0) {
            // Возврат на первый шаг
            document.getElementById("step1").style.display = "block";
            document.getElementById("step2").style.display = "none";
            document.getElementById("step3").style.display = "none";
          } else if (selectedPath.length === 1) {
            // Возврат на второй шаг
            const parentValue = selectedPath[0];
            const parent = window.formConfig?.main.find(item => item.label === parentValue);

            if (parent?.children) {
              document.getElementById("step1").style.display = "none";
              document.getElementById("step2").style.display = "block";
              document.getElementById("step3").style.display = "none";

              window.renderOptions(parent.children, "step2", window.handleSelection, () => {
                document.getElementById("step2").style.display = "none";
                document.getElementById("step1").style.display = "block";
              });
            }
          } else if (selectedPath.length === 2) {
            // Возврат на третий шаг
            const grandParentLabel = selectedPath[0];
            const parentLabel = selectedPath[1];
            const grandParent = window.formConfig?.main.find(item => item.label === grandParentLabel);

            if (grandParent?.children) {
              const parent = grandParent.children.find(item => item.label === parentLabel);

              if (parent?.children) {
                document.getElementById("step1").style.display = "none";
                document.getElementById("step2").style.display = "none";
                document.getElementById("step3").style.display = "block";

                window.renderOptions(parent.children, "step3", window.handleSelection, () => {
                  document.getElementById("step3").style.display = "none";
                  document.getElementById("step2").style.display = "block";
                });
              }
            }
          } else if (selectedPath.length === 3) {
            // Возврат на step3 (третий уровень)
            // Путь: "На секцию" → "Единоборства" → "Тренеры" → [выбранный тренер]
            // selectedPath после pop = ["На секцию", "Единоборства", "Тренеры"]
            const level1 = selectedPath[0]; // "На секцию"
            const level2 = selectedPath[1]; // "Единоборства"
            const level3 = selectedPath[2]; // "Тренеры"

            const parent1 = window.formConfig?.main.find(item => item.label === level1);
            if (parent1?.children) {
              const parent2 = parent1.children.find(item => item.label === level2);
              if (parent2?.children) {
                const parent3 = parent2.children.find(item => item.label === level3);
                if (parent3?.children) {
                  document.getElementById("step1").style.display = "none";
                  document.getElementById("step2").style.display = "none";
                  document.getElementById("step3").style.display = "block";

                  window.renderOptions(parent3.children, "step3", window.handleSelection, () => {
                    document.getElementById("step3").style.display = "none";
                    document.getElementById("step2").style.display = "block";
                  });
                }
              }
            }
          }
        });
      }
    }, 100);
  };
});
